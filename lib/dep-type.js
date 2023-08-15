import jessy from 'jessy';

export default (name, object) => {
    const dep = 'dependencies';
    const devDep = 'devDependencies';
    const depProperty = [dep, name].join('.');
    const devDepProperty = [devDep, name].join('.');
    
    if (jessy(depProperty, object))
        return dep;
    
    if (jessy(devDepProperty, object))
        return devDep;
    
    return '';
};
