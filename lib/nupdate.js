'use strict';

const detect = require('detect-indent');
const jonny = require('jonny');
const nessy = require('nessy');
const sort = require('sorted-object');

const depType = require('./dep-type');

module.exports = (name, version, info, options) => {
    options = options || {};
    
    const prefix = options.exact ? '' : '^';
    const indent = detect(info).indent
    const json = jonny.parse(info);
    const dep = getDep(name, json, options);
    
    if (!dep)
        return info;
    
    const field = `${dep}*${name}`;
    const result = nessy(field, prefix + version, '*', json);
    const sorted = Object.assign({}, result, {
        [dep]: sort(result[dep])
    });
    
    return jonny.stringify(sorted, null, indent);
};

function getDep(name, json, options) {
    const dep = depType(name, json);
    
    if (dep)
        return dep;
    
    if (!options.add)
        return '';
    
    if (options.dev)
        return 'devDependencies';
     
    return 'dependencies';
}

