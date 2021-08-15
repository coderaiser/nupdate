export default (str) => {
    if (/\n$/.test(str))
        return str;
    
    return `${str}\n`;
};

