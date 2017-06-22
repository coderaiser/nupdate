'use strict';

module.exports = (str) => {
    if (/\n$/.test(str))
        return str;
    
    return `${str}\n`;
}

