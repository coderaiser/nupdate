#!/usr/bin/env node

'use strict';

const argv = process.argv.slice(2);
const args = require('minimist')(argv, {
    string: [
    ],
    boolean: [
        'version',
        'help',
        'dev',
        'auto'
    ],
    default: {
        auto: true
    },
    alias: {
        v: 'version',
        h: 'help',
        d: 'dev',
        a: 'auto'
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
        dev: args.dev,
        auto: !args.dev && args.auto
    });
}

function main(name, options) {
    if (!name)
        return console.error('Module name could not be empty');
    
    const nupdate = require('..');
    
    nupdate(name, options, (error, update) => {
        if (error)
            return console.error(error.message);
        
        update.on('error', (error) => {
            process.stderr.write(error.message);
        });
        
        update.on('data', (data) => {
            process.stdout.write(data);
        });
        
        update.on('close', () => {
            update = null;
        });
    });
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

