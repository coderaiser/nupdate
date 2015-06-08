#!/usr/bin/env node

(function() {
    'use strict';
    
    var nupdate,
        argv        = process.argv.slice(2),
        args        = require('minimist')(argv, {
            string: [
            ],
            boolean: [
                'version',
                'help',
                'dev',
            ],
            alias: {
                v: 'version',
                h: 'help',
                d: 'dev'
            }
        });
    console.log(args)
    if (!args.length && args.help) {
        help();
    } else if (args.version) {
        console.log('v' + require('../package').version);
    } else {
        nupdate = require('..');
        
        main(args._[0], args.dev);
    }
    
    function main(name, dev) {
        var update;
        
        if (!name) {
            console.error('Module name could not be empty');
        } else {
            update = nupdate(name, {dev: dev});
            
            update.on('error', function(error) {
                process.stderr.write(error.message);
            });
            
            update.on('data', function(data) {
                process.stdout.write(data);
            });
            
            update.on('close', function() {
                update = null;
            });
        }
    }
    
    function help() {
        var bin     = require('../json/help'),
            usage   = 'Usage: nupdate [options]';
        
        console.log(usage);
        console.log('Options:');
        
        Object.keys(bin).forEach(function(name) {
            var line = '  ' + name + ' ' + bin[name];
            console.log(line);
        });
    }
})();
