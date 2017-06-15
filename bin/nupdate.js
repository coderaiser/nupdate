#!/usr/bin/env node

'use strict';

const fs = require('fs');
const execSync = require('child_process').execSync;
const promisify = require('es6-promisify');
const currify = require('currify');
const wraptile = require('wraptile');

const tryExec = promisify(_tryExec);
const update = currify(_update);
const ifInstall = wraptile(_ifInstall);
const ifCommit = wraptile(_ifCommit);

const cwd = process.cwd;

const argv = process.argv.slice(2);
const args = require('minimist')(argv, {
    boolean: [
        'version',
        'help',
        'save-exact',
        'install',
        'dev',
        'commit',
    ],
    alias: {
        v: 'version',
        h: 'help',
        E: 'save-exact',
        i: 'install',
        D: 'dev',
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
} else {
    main(args._[0], {
        exact: args['save-exact'],
        install: args.install,
        dev: args.dev,
        commit: args.commit,
    });
}

function main(name, options) {
    if (!name)
        return console.error('Module name could not be empty');
    
    const fullstore = require('fullstore');
    const version = fullstore();
    
    const cmd = `npm info ${name} --json`;
    
    tryExec(cmd)
        .then(JSON.parse)
        .then(getVersion)
        .then(version)
        .then(update(name, options))
        .then(save)
        .then(ifInstall(options.install, name))
        .then(ifCommit(options.commit, name, version))
        .catch(onError);
}

function _ifInstall(is, name) {
    if (!is)
        return;
     
    return tryExec(`npm i ${name}`)
        .then(console.log)
}

function _ifCommit(is, name, version) {
    if (!is)
        return;
    
    const cmd = [
        `git add package.json`,
        `git commit -m "feature(package) ${name} v${version()}"`,
    ].join('&&');
    
    return tryExec(cmd)
        .then(console.log)
}

function _update(name, options, version) {
    const nupdate = require('..');
    const info = fs.readFileSync(`${cwd()}/package.json`, 'utf8');
    
    const result = nupdate(name, version, info, options);
    return result;
}

function _tryExec(cmd, fn) {
    const tryCatch = require('try-catch');
    
    const error = tryCatch(() => {
        const data = execSync(cmd).toString();
        fn(null, data);
    });
    
    error && fn(error);
}

function onError(error) {
    if (error)
        return console.error(error.message);
}

function getVersion(info) {
    return info.version;
}

function save(data) {
    const name = `${cwd()}/package.json`;
    fs.writeFileSync(name, data);
}

function exit() {
    console.error.apply(console, arguments);
    process.exit(1);
}

function help() {
    const bin = require('../json/help');
    const usage = 'Usage: nupdate [options]';
    
    console.log(usage);
    console.log('Options:');
    
    Object.keys(bin)
        .map((name) => {
            return `  '${name} ${bin[name]}`;
        })
        .forEach((line) => {
            console.log(line);
        });
}

