import test from 'supertape';
import eof from '../lib/eof.js';

test('eof: no', (t) => {
    t.equal(eof('hello'), 'hello\n');
    t.end();
});

test('eof: yes', (t) => {
    t.equal(eof('hello\n'), 'hello\n');
    t.end();
});
