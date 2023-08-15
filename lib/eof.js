export default (str) => {
    if (str.endsWith('\n'))
        return str;
    
    return `${str}\n`;
};
