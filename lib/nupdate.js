(function() {
    'use strict';
    
    var fs          = require('fs'),
        assert      = require('assert'),
        
        async       = require('async'),
        spawnify    = require('spawnify'),
        rendy       = require('rendy'),
        readjson    = require('readjson'),
        
        depType     = require('./dep-type');
    
    module.exports = function(name, options, callback) {
        assert(name, 'name could not be empty!');
        
        if (!options)
            options = {};
            
        async.series({
            package: function(callback) {
                if (!options.auto)
                    callback();
                else
                    readPackage(name, options, callback);
            },
            command: function(callback) {
                makeCommand(name, options, callback);
            },
        }, function(error, results) {
            callback(error, results.command);
        });
    };
    
    function makeCommand(name, options, callback) {
        fs.stat('node_modules/' + name, function(e) {
            var result,
                error,
                cmd = command(name, options);
            
            if (e)
                if (e.code !== 'ENOENT')
                    error = e;
                else
                    cmd = rendy('npm i {{ name }}', {
                        name: name
                    }) + ';' + cmd;
            
            if (!error)
                result = spawnify(cmd);
            
            callback(error, result);
        });
    }
    
    function readPackage(name, options, callback) {
        readjson('package.json', function(error, json) {
            var type;
            
            if (error) {
                callback(error);
            } else {
                type = depType(name, json);
                
                if (type === 'devDependencies')
                    options.dev = true;
                
                callback();
            }
        });
    }
    
    function command(name, options) {
        var dev         = options.dev ? '-dev' : '',
            update      = '{{ remove }} && {{ install }}',
            cmd         = 'npm {{ command }} {{ name }} --save{{ dev }}',
            
            install     = rendy(cmd, {
                command : 'install',
                name    : name,
                dev     : dev
            }),
            
            remove      = rendy(cmd, {
                command : 'remove',
                name    : name,
                dev     : dev
            }),
            
            result          = rendy(update, {
                install : install,
                remove  : remove
            });
        
        return result;
    }
    
})();
