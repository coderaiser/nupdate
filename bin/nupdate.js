#!/usr/bin/env node

(function() {
    'use strict';
    
    var nupdate     = require('..'),
        
        args        = process.argv.slice(2),
        arg         = args[0],
        dev;
    
    if (!arg || isArg(args, ['-h', '--help'])) {
        help();
    } else if (isArg(args, ['-v', '--version'])) {
        console.log('v' + require('../package').version);
    } else {
        if (isArg(args, ['-d', '--dev']))
            dev = true;
        
        if (dev && args.length < 2)
            console.error('Module name could noe be empty!');
        else
            args.some(function(name) {
                if (!~arg.indexOf('-'))
                    main(name, dev);
            });
    }
    
    function main(name, dev) {
        var update = nupdate(name, {dev: dev});
        
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
    
    function isArg(args, params) {
        var arr = Array.isArray(params) ? params : [params],
            is  = args.some(function(item) {
                return arr.some(function(param) {
                    return ~item.indexOf(param);
                });
            });
        
        return is;
    }
})();
