import {test} from 'supertape';
import {getVersion} from './version.js';

test('nupdate: version: getVersion', (t) => {
    const result = getVersion({
        version: '1.0.0',
    });
    
    const expected = '1.0.0';
    
    t.equal(result, expected);
    t.end();
});

test('nupdate: version: getVersion: npm v12: array', (t) => {
    const result = getVersion([{
        version: '1.0.0',
    }]);
    
    const expected = '1.0.0';
    
    t.equal(result, expected);
    t.end();
});
