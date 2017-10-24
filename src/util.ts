export function values<T>(dict: { [k: string]: T }): Array<T> {
  return Object.keys(dict).map(key => dict[key]);
}

export function difference<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  return arr1.filter(x => arr2.indexOf(x) < 0);
}

export function find<T>(arr: Array<T>, predicate: (x: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return arr[i];
  }
  return null;
}

export function findIndex(arr: any[], predicate: (x: any) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

export function intersection<T>(arr1: Array<T>, arr2: Array<T>): Array<T> {
  return arr1.filter(x => arr2.indexOf(x) >= 0);  
}