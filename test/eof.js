'use strict';

const test = require('tape');
const eof = require('../lib/eof');

test('eof: no', (t) => {
    t.equal(eof('hello'), 'hello\n');
    t.end();
});

test('eof: yes', (t) => {
    t.equal(eof('hello\n'), 'hello\n');
    t.end();
});

