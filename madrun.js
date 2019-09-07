'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => 'putout bin lib test madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': () => run('watcher', 'npm test'),
};

