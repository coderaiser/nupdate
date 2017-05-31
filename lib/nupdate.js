'use strict';

var fs = require('fs');
var assert = require('assert');

var async = require('async');
var spawnify = require('spawnify');
var rendy = require('rendy');
var readjson = require('readjson');
var depType = require('./dep-type');

module.exports = function(name, options, callback) {
    assert(name, 'name could not be empty!');
    
    if (!options)
        options = {};
    
    async.series({
        package: function(callback) {
            if (!options.auto)
                return callback();
            
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
        var result;
        var error;
        var cmd = command(name, options);
        
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
        
        if (error)
            return callback(error);
            
        type = depType(name, json);
        
        if (type === 'devDependencies')
            options.dev = true;
        
        callback();
    });
}

function command(name, options) {
    var dev = options.dev ? '-dev' : '';
    var update = '{{ remove }} && {{ install }}';
    var cmd = 'npm {{ command }} {{ name }} --save{{ dev }}';
    
    var install = rendy(cmd, {
        command : 'install',
        name    : name,
        dev     : dev
    });
    
    var remove = rendy(cmd, {
        command : 'remove',
        name    : name,
        dev     : dev
    });
    
    var result = rendy(update, {
        install : install,
        remove  : remove
    });
    
    return result;
}

