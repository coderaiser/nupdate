import detect from 'detect-indent';
import jonny from 'jonny';
import nessy from 'nessy';

export default (access, data) => {
    const {indent} = detect(data);
    const json = jonny.parse(data);
    
    const result = nessy('publishConfig.access', access, json);
    
    return jonny.stringify(result, null, indent);
};
