'use strict';

var jessy = require('jessy/legacy');

module.exports = function(name, object) {
    var result,
        dep             = 'dependencies',
        devDep          = 'devDependencies',
        depProperty     = [dep, name].join('.'),
        devDepProperty  = [devDep, name].join('.');
    
    if (jessy(depProperty, object))
        result = dep;
    else if (jessy(devDepProperty, object))
        result = devDep;
    
    return result;
};

