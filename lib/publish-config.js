'use strict';

const detect = require('detect-indent');
const jonny = require('jonny');
const nessy = require('nessy');

module.exports = (access, data) => {
    const {indent} = detect(data);
    const json = jonny.parse(data);
    
    const result = nessy('publishConfig.access', access, json);
    
    return jonny.stringify(result, null, indent);
};

