(function() {
    'use strict';
    
    var fs          = require('fs'),
        assert      = require('assert'),
        spawnify    = require('spawnify'),
        rendy       = require('rendy');
    
    module.exports = function(name, options, callback) {
        assert(name, 'name could not be empty!');
        
        if (!options)
            options = {};
        
        fs.stat('node_modules/' + name, function(e) {
            var error,
                cmd = command(name, options);
            
            if (e)
                if (e.code !== 'ENOENT')
                    error = e;
                else
                    cmd = rendy('npm i {{ name }}', {
                        name: name
                    }) + ';' + cmd;
                
            callback(error, spawnify(cmd));
        });
    };
    
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
