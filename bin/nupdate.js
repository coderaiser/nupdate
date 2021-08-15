#!/usr/bin/env node

import fs from 'fs';
import {execSync} from 'child_process';
import wraptile from 'wraptile';
import currify from 'currify';
import minimist from 'minimist';
import {createSimport} from 'simport';

import eof from '../lib/eof.js';

const simport = createSimport(import.meta.url);

const update = wraptile(_update);
const ifInstall = wraptile(_ifInstall);
const ifCommit = wraptile(_ifCommit);
const save = currify(_save);

const {stdout} = process;
const write = stdout.write.bind(stdout);

const argv = process.argv.slice(2);

const args = minimist(argv, {
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
        'set-any',
    ],
    alias: {
        'v': 'version',
        'h': 'help',
        'E': 'save-exact',
        'i': 'install',
        'D': 'dev',
        'a': 'add',
        'r': 'remove',
        'c': 'commit',
        '*': 'set-any',
    },
    unknown: (cmd) => {
        const msg = '\'%s\' is not a nupdate option. See \'nupdate --help\'.';
        
        if (/^--?/.test(cmd))
            exit(msg, cmd);
    },
});

if (!args.length && args.help) {
    help();
} else if (args.version) {
    console.log('v' + await simport('../package').version);
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
        setAny: args['set-any'],
    }).catch(onError);
}

function getAccess({isPublic}) {
    if (isPublic)
        return 'public';
    
    return 'restricted';
}

async function updatePublishConfig({isPublic, isCommit}) {
    const publishConfig = await import('../lib/publish-config');
    
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

function getCmd({name, version}) {
    if (!version)
        return `npm info ${name} --json`;
    
    return `echo '{"version": "${version}"}'`;
}

async function main(pattern, options) {
    if (!pattern)
        return console.error(`Module pattern could not be empty`);
    
    const [name, version] = pattern.split(':');
    
    const fullstore = await simport('fullstore');
    const versionStore = fullstore();
    const pathStore = fullstore();
    
    const cmd = getCmd({
        name,
        version,
    });
    
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
        .then(ifCommit(options.commit, name, pathStore, versionStore));
}

function _ifInstall(is, name) {
    if (!is)
        return;
    
    return tryExec(`npm i ${name} --no-save`)
        .then(write);
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
        .then(write);
}

async function find() {
    const findUp = await simport('find-up');
    return await findUp('package.json');
}

async function _update(name, options, path, version) {
    if (!name)
        return;
    
    const nupdate = await simport('../lib/nupdate.js');
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
    console.error(...args);
    process.exit(1);
}

async function help() {
    const bin = await simport('../json/help.json');
    const forEachKey = await simport('for-each-key');
    const usage = 'Usage: nupdate [pattern] [options]';
    
    const log = currify((a, b, c) => console.log(a, b, c));
    
    console.log(usage);
    console.log('Options:');
    
    forEachKey(log(' %s %s'), bin);
}

