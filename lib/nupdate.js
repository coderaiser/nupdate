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
    const dep = getDep(name, json, options);
    
    if (!dep)
        return info;
    
    const field = `${dep}.${name}`;
    const result = nessy(field, prefix + version, json);
    
    return jonny.stringify(result, null, indent);
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

