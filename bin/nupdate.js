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
    
    if (!args.length && args.help) {
        help();
    } else if (args.version) {
        console.log('v' + require('../package').version);
    } else {
        nupdate = require('..');
        
        main(args._[0], {
            dev: args.dev,
            auto: args.auto
        });
    }
    
    function main(name, options) {
        if (!name) {
            console.error('Module name could not be empty');
        } else {
            nupdate(name, options, function(error, update) {
                if (error)
                    return console.error(error.message);
                
                update.on('error', function(error) {
                    process.stderr.write(error.message);
                });
                
                update.on('data', function(data) {
                    process.stdout.write(data);
                });
                
                update.on('close', function() {
                    update = null;
                });
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
