import test from 'supertape';
import publishConfig from '../lib/publish-config.js';

const {stringify} = JSON;

test('publish-config: public', (t) => {
    const result = publishConfig('public', stringify({}));
    const expected = stringify({
        publishConfig: {
            access: 'public',
        },
    });
    
    t.equal(result, expected, 'should equal');
    t.end();
});

test('publish-config: private', (t) => {
    const result = publishConfig('private', stringify({}));
    const expected = stringify({
        publishConfig: {
            access: 'private',
        },
    });
    
    t.equal(result, expected, 'should equal');
    t.end();
});
