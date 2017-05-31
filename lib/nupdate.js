'use strict';

const fs = require('fs');
const assert = require('assert');

const async = require('async');
const spawnify = require('spawnify');
const rendy = require('rendy');
const readjson = require('readjson');
const depType = require('./dep-type');

module.exports = (name, options, callback) => {
    assert(name, 'name could not be empty!');
    
    if (!options)
        options = {};
    
    async.series({
        package: (callback) => {
            if (!options.auto)
                return callback();
            
            readPackage(name, options, callback);
        },
        command: (callback) => {
            makeCommand(name, options, callback);
        },
    }, (error, results) => {
        callback(error, results.command);
    });
};

function getCmd(e, name, options) {
    const cmd = command(name, options);
    
    if (!e)
        return cmd;
    
    const install = `npm i ${name}`;
    
    return install + ';' + cmd;
}

function makeCommand(name, options, callback) {
    fs.stat('node_modules/' + name, (e) => {
        if (e && e.code !== 'ENOENT')
            return callback(e);
        
        const cmd = getCmd(e, name, options);
        const result = spawnify(cmd);
        
        callback(e, result);
    });
}

function readPackage(name, options, callback) {
    readjson('package.json', (error, json) => {
        if (error)
            return callback(error);
            
        const type = depType(name, json);
        
        if (type === 'devDependencies')
            options.dev = true;
        
        callback();
    });
}

function command(name, options) {
    const dev = options.dev ? '-dev' : '';
    const update = '{{ remove }} && {{ install }}';
    const cmd = 'npm {{ command }} {{ name }} --save{{ dev }}';
    
    const install = rendy(cmd, {
        command : 'install',
        name,
        dev,
    });
    
    const remove = rendy(cmd, {
        command : 'remove',
        name,
        dev,
    });
    
    const result = rendy(update, {
        install,
        remove,
    });
    
    return result;
}

