import detect from 'detect-indent';
import jonny from 'jonny';
import nessy from 'nessy';
import sort from 'sorted-object';
import finicky from 'finicky';
import depType from './dep-type.js';

const update = (field, value, json, options) => {
    if (options.remove)
        return finicky(field, '*', json);
    
    if (options.setAny)
        return nessy(field, '*', '*', json);
    
    return nessy(field, value, '*', json);
};

export const nupdate = (name, version, info, options = {}) => {
    const prefix = options.exact ? '' : '^';
    const {indent} = detect(info);
    const json = jonny.parse(info);
    const dep = getDep(name, json, options);
    
    if (!dep)
        return info;
    
    const field = `${dep}*${name}`;
    
    const result = update(field, prefix + version, json, {
        remove: options.remove,
        setAny: options.setAny,
    });
    
    const sorted = {
        ...result,
        [dep]: sort(result[dep]),
    };
    
    return jonny.stringify(sorted, null, indent);
};

function getDep(name, json, options) {
    const dep = depType(name, json);
    
    if (dep)
        return dep;
    
    if (!options.add)
        return '';
    
    if (options.dev)
        return 'devDependencies';
    
    return 'dependencies';
}
