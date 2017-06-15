'use strict';

const jessy = require('jessy');

module.exports = (name, object) => {
    const dep = 'dependencies';
    const devDep = 'devDependencies';
    const devDepProperty = [devDep, name].join('.');
    
    if (jessy(devDepProperty, object))
        return devDep;
    
    return dep;
};

