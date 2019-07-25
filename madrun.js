'use strict';

const {run} = require('madrun');

module.exports = {
    'lint': () => 'eslint bin lib test madrun.js',
    'fix:lint': () => run('lint', '--fix'),
    'lint:eslint:bin': () => 'eslint --rule \'no-console:0\' bin',
    'test': () => 'tape test/*.js',
    'coverage': () => 'nyc npm test',
    'report': () => 'nyc report --reporter=text-lcov | coveralls',
    'watcher': () => 'nodemon -w test -w lib --exec',
    'watch:test': () => run('watcher', 'npm test'),
};

