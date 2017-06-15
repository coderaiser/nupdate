'use strict';

const depType = require('./dep-type');
const detect = require('detect-indent');
const jonny = require('jonny');
const nessy = require('nessy');

module.exports = (name, version, info, options) => {
    options = options || {};
    
    const prefix = options.exact ? '' : '^';
    
    const indent = detect(info).indent
    const json = jonny.parse(info);
    const dep = options.dev ? 'devDependencies' : depType(name, json);
    
    const field = `${dep}.${name}`;
    const result = nessy(field, prefix + version, json);
    
    return jonny.stringify(result, null, indent);
};

