import test from 'supertape';
import eof from '../lib/eof.js';

test('eof: no', (t) => {
    const result = eof('hello');
    const expected = 'hello\n';
    
    t.equal(result, expected);
    t.end();
});

test('eof: yes', (t) => {
    const result = eof('hello\n');
    const expected = 'hello\n';
    
    t.equal(result, expected);
    t.end();
});
