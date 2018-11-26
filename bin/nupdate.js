#!/usr/bin/env node

'use strict';

const fs = require('fs');
const {execSync} = require('child_process');
const wraptile = require('wraptile');
const currify = require('currify');
const eof = require('../lib/eof');

const update = wraptile(_update);
const ifInstall = wraptile(_ifInstall);
const ifCommit = wraptile(_ifCommit);
const save = currify(_save);

const stdout = process.stdout;
const write = stdout.write.bind(stdout);

const argv = process.argv.slice(2);
const args = require('minimist')(argv, {
    boolean: [
        'version',
        'help',
        'save-exact',
        'install',
        'dev',
        'commit',
        'add',
        'remove',
        'public',
        'restricted',
    ],
    alias: {
        v: 'version',
        h: 'help',
        E: 'save-exact',
        i: 'install',
        D: 'dev',
        a: 'add',
        r: 'remove',
        c: 'commit'
    },
    unknown: (cmd) => {
        const msg = '\'%s\' is not a nupdate option. See \'nupdate --help\'.';
        
        if (/^--?/.test(cmd))
            exit(msg, cmd);
    }
});

if (!args.length && args.help) {
    help();
} else if (args.version) {
    console.log('v' + require('../package').version);
} else if (args.public || args.restricted) {
    updatePublishConfig({
        isPublic: args.public,
        isCommit: args.commit,
    }).catch(onError);
} else {
    main(args._[0], {
        exact: args['save-exact'],
        install: args.install,
        dev: args.dev,
        commit: args.commit,
        add: args.add,
        remove: args.remove,
    }).catch(onError);
}

function getAccess({isPublic}) {
    if (isPublic)
        return 'public';
    
    return 'restricted';
}

async function updatePublishConfig({isPublic, isCommit}) {
    const publishConfig = require('../lib/publish-config');
    
    const access = getAccess({
        isPublic,
    });
    
    const path = await find();
    const data = fs.readFileSync(path, 'utf8');
    const result = publishConfig(access, data);
    
    fs.writeFileSync(path, eof(result));
    
    if (!isCommit)
        return;
    
    const commit = [
        `git add ${path}`,
        `git commit -m "chore(package) publishConfig: access: ${access}"`,
    ].join('&&');
    
    const cmd = `${commit} || true`;
    const str = await tryExec(cmd);
    
    write(str);
}

async function main(name, options) {
    if (!name)
        return console.error('Module name could not be empty');
    
    const fullstore = require('fullstore');
    const versionStore = fullstore();
    const pathStore = fullstore();
    
    const cmd = `npm info ${name} --json`;
    
    return tryExec(cmd)
        .then(JSON.parse)
        .then(getVersion)
        .then(versionStore)
        .then(find)
        .then(pathStore)
        .then(update(name, options, pathStore, versionStore))
        .then(eof)
        .then(save(pathStore))
        .then(ifInstall(options.install, name))
        .then(ifCommit(options.commit, name, pathStore, versionStore))
}

function _ifInstall(is, name) {
    if (!is)
        return;
    
    return tryExec(`npm i ${name} --no-save`)
        .then(write)
}

function _ifCommit(is, name, path, version) {
    if (!is)
        return;
    
    const commit = [
        `git add ${path()}`,
        `git commit -m "feature(package) ${name} v${version()}"`,
    ].join('&&');
    
    const cmd = `${commit} || true`;
    
    return tryExec(cmd)
        .then(write)
}

function find() {
    const findUp = require('find-up');
    return findUp('package.json');
}

function _update(name, options, path, version) {
    if (!name)
        return;
    
    const nupdate = require('..');
    const info = fs.readFileSync(path(), 'utf8');
    const result = nupdate(name, version(), info, options);
    
    return result;
}

async function tryExec(cmd) {
    return execSync(cmd).toString();
}

function onError(error) {
    if (error)
        return console.error(error.message);
}

function getVersion(info) {
    return info.version;
}

function _save(pathStore, data) {
    fs.writeFileSync(pathStore(), data);
}

function exit(...args) {
    console.error.apply(console, args);
    process.exit(1);
}

function help() {
    const bin = require('../json/help');
    const forEachKey = require('for-each-key');
    const usage = 'Usage: nupdate [options]';
    
    const log = currify((a, b, c) => console.log(a, b, c));
    
    console.log(usage);
    console.log('Options:');
    
    forEachKey(log(' %s %s'), bin);
}

