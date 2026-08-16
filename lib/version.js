const {isArray} = Array;

export const getVersion = (info) => {
    if (isArray(info))
        return info[0].version;
    
    return info.version;
};
