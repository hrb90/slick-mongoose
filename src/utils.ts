export const findIndex = (arr, pred) => {
    arr.forEach((val, idx) => {
        if (pred(val)) return idx;
    });
    return -1;
};

export const includes = (arr, value) => {
    arr.forEach(val => {
        if (val === value) return true;
    })
    return false;
};

export const subtractArrs = (arr1, arr2) => {
    return arr1.filter(v => !includes(arr2, v));
}

export const values = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
}