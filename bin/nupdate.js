#!/usr/bin/env node

import {createRequire} from 'node:module';
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import wraptile from 'wraptile';
import currify from 'currify';
import minimist from 'minimist';
import process from 'node:process';
import eof from '../lib/eof.js';

const require = createRequire(import.meta.url);

const update = wraptile(_update);
const ifInstall = wraptile(_ifInstall);
const ifCommit = wraptile(_ifCommit);
const save = currify(_save);

const resolve = Promise.resolve.bind(Promise);
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
        const msg = `'%s' is not a nupdate option. See 'nupdate --help'.`;
        
        if (cmd.startsWith('--?'))
            exit(msg, cmd);
    },
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
        setAny: args['set-any'],
    }).catch(onError);
}

function getAccess({isPublic}) {
    if (isPublic)
        return 'public';
    
    return 'restricted';
}

async function updatePublishConfig({isPublic, isCommit}) {
    const publishConfig = await import('../lib/publish-config.js');
    
    const access = getAccess({
        isPublic,
    });
    
    const path = await find();
    const data = fs.readFileSync(path, 'utf8');
    const {name, commitType = 'colon'} = JSON.parse(data);
    const result = publishConfig(access, data);
    
    fs.writeFileSync(path, eof(result));
    
    if (!isCommit)
        return;
    
    const commitColon = `git commit -m "chore: ${name}: publishConfig: access: ${access}"`;
    const commitParen = `git commit -m "chore(${name}) publishConfig: access: ${access}"`;
    const commitByType = commitType === 'colon' ? commitColon : commitParen;
    
    const commit = [
        `git add ${path}`,
        commitByType,
    ].join('&&');
    
    const cmd = `${commit} || true`;
    const str = tryExec(cmd);
    
    write(str);
}

function getCmd({name, version}) {
    if (!version)
        return `npm info ${name} --json --no-workspaces`;
    
    return `echo '{"version": "${version}"}'`;
}

async function main(pattern, options) {
    if (!pattern)
        return console.error(`Module pattern could not be empty`);
    
    const [name, version] = pattern.split(':');
    
    const {default: fullstore} = await import('fullstore');
    const versionStore = fullstore();
    const pathStore = fullstore();
    
    const cmd = getCmd({
        name,
        version,
    });
    
    return resolve(tryExec(cmd))
        .then(JSON.parse)
        .then(getVersion)
        .then(versionStore)
        .then(find)
        .then(pathStore)
        .then(update(
            name,
            options,
            pathStore,
            versionStore,
        ))
        .then(eof)
        .then(save(pathStore))
        .then(ifInstall(options.install, name))
        .then(ifCommit({
            options,
            name,
            pathStore,
            versionStore,
        }));
}

function _ifInstall(is, name) {
    if (!is)
        return;
    
    return resolve(tryExec(`npm i ${name} --no-save`)).then(write);
}

function _ifCommit({options, name, pathStore, versionStore}) {
    if (!options.commit)
        return;
    
    const data = fs.readFileSync(pathStore(), 'utf8');
    const {name: mainName, commitType = 'colon'} = JSON.parse(data);
    
    const message = options.remove ? ': drop' : ` v${versionStore()}`;
    
    const commitColon = `git commit -m "feature: ${mainName}: ${name}${message}"`;
    const commitParen = `git commit -m "feature(${mainName}) ${name}${message}"`;
    const commitByType = commitType === 'colon' ? commitColon : commitParen;
    
    const commit = [
        `git add ${pathStore()}`,
        commitByType,
    ].join('&&');
    
    const cmd = `${commit} || true`;
    
    return write(tryExec(cmd));
}

async function find() {
    const {findUp} = await import('find-up');
    return await findUp('package.json');
}

async function _update(name, options, path, version) {
    if (!name)
        return;
    
    const {nupdate} = await import('../lib/nupdate.js');
    const info = fs.readFileSync(path(), 'utf8');
    
    return nupdate(name, version(), info, options);
}

function tryExec(cmd) {
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
    const bin = require('../json/help.json');
    const {default: forEachKey} = await import('for-each-key');
    const usage = 'Usage: nupdate [pattern] [options]';
    
    const log = currify((a, b, c) => console.log(a, b, c));
    
    console.log(usage);
    console.log('Options:');
    
    forEachKey(log(' %s %s'), bin);
}
