/**
 * 
 * @param {any} obj source object
 * @param {string} key key of the value
 * @param {any} defaultValue default value if key doesn't exist
 */
export function GetValue(obj: any, key: string, defaultValue: any) {
  if (!obj) {
    return defaultValue;
  }
  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }
  if (typeof obj === 'function' || Array.isArray(obj)) {
    return undefined;
  }
  if (obj.hasOwnProperty(key)) {
    return obj[key];
  }
  let index = key.indexOf('.');
  if (index !== -1) {
    let sourceKey = key.slice(0, index);
    let valueKey = key.slice(index + 1);
    if (obj.hasOwnProperty(sourceKey)) {
      return GetValue(obj[sourceKey], valueKey, defaultValue);
    }
  }
  return defaultValue;
}

export function noop() { }

export interface IDisposable {
  dispose(): void;
}

/**
 * return a random integer between min (inclusive) and max (exclusive);
 * @param min min value, inclusive
 * @param max max value, exclusive
 */
export function between(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}