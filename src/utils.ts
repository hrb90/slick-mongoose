export const findIndex = (arr, pred) => {
  let idx = -1;
  arr.forEach((val, i) => {
    if (pred(val)) idx = i;
  });
  return idx;
};

export const find = (arr, pred) => {
  const idx = findIndex(arr, pred);
  if (idx > -1) {
    return arr[idx];
  } else {
    return null;
  }
};

export const includes = (arr, value) => {
  let seen = false;
  arr.forEach(val => {
    if (val === value) {
      seen = true;
    }
  });
  return seen;
};

export const subtractArrs = (arr1, arr2) => {
  return arr1.filter(v => !includes(arr2, v));
};

export const values = obj => {
  return Object.keys(obj).map(key => obj[key]);
};

export const intersection = (arr1, arr2) => {
  return arr1.filter(v => includes(arr2, v));
};

export const mapValues = (obj, callback) => {
  let newObj = {};
  Object.keys(obj).forEach(key => {
    newObj[key] = callback(obj[key]);
  });
  return newObj;
};
