(function() {
    'use strict';
    
    var assert      = require('assert'),
        spawnify    = require('spawnify'),
        rendy       = require('rendy');
    
    module.exports = function(name, options) {
        var cmd, spawn;
        
        assert(name, 'name could not be empty!');
        
        if (!options)
            options = {};
        
        cmd = command(name, options);
        
        spawn   = spawnify(cmd);
        
        return spawn;
    };
    
    function command(name, options) {
        var dev         = options.dev ? '-save-dev' : '',
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
