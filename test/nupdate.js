'use strict';

const test = require('tape');
const nupdate = require('..');

const stringify = (obj) => {
    return JSON.stringify(obj, null, 4);
};

test('update dependencies', (t) => {
    const info = stringify({
        dependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info);
    const expected = stringify({
        dependencies: {
            rendy: '^4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should update version in dependencies');
    t.end();
});

test('update devDependencies', (t) => {
    const info = stringify({
        devDependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info);
    const expected = stringify({
        devDependencies: {
            rendy: '^4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should update version in devDependencies');
    t.end();
});

test('update devDependencies: exact', (t) => {
    const info = stringify({
        devDependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info, {
        exact: true
    });
    
    const expected = stringify({
        devDependencies: {
            rendy: '4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should update version in devDependencies');
    t.end();
});

test('add: update no dependencies, no devDependencies', (t) => {
    const info = stringify({
        someDependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info, {
        add: true
    });
    
    const expected = stringify({
        someDependencies: {
            rendy: '^4.1.0'
        },
        dependencies: {
            rendy: '^4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should return input data');
    t.end();
});

test('add, dev: update no dependencies, no devDependencies', (t) => {
    const info = stringify({
        someDependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info, {
        add: true,
        dev: true,
    });
    
    const expected = stringify({
        someDependencies: {
            rendy: '^4.1.0'
        },
        devDependencies: {
            rendy: '^4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should return input data');
    t.end();
});

test('not update when no dependencies, no devDependencies', (t) => {
    const info = stringify({
        someDependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info);
    
    t.deepEqual(result, info, 'should return input data');
    t.end();
});

test('update dendencies when dev flag set', (t) => {
    const info = stringify({
        dependencies: {
            rendy: '^4.1.0'
        }
    });
    
    const result = nupdate('rendy', '4.2.0', info, {
        dev: true
    });
    
    const expected = stringify({
        dependencies: {
            rendy: '^4.2.0'
        }
    });
    
    t.deepEqual(result, expected, 'should update dependency');
    t.end();
});

