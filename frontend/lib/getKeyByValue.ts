export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function getKeyByValueAtIndex(object, value, index) {
    return Object.keys(object).find(key => object[key][index] === value[index]);
}
