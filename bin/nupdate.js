#!/usr/bin/env node

(function() {
    'use strict';
    
    var nupdate,
        args        = process.argv.slice(2),
        arg         = args[0],
        dev;
    
    if (!arg || /-h|--help/.test(args)) {
        help();
    } else if (/-v|--version/.test(args)) {
        console.log('v' + require('../package').version);
    } else {
        nupdate = require('..');
        
        args.some(function(name) {
            var result = !/-d|--dev/.test(name);
            
            if (result) {
                main(name, dev);
            } else {
                dev = true;
                
                if (args.length < 2)
                    console.error('Module name could noe be empty!');
            }
            
            return result;
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
})();
