export function isUndefined(value) {
  return typeof value === "undefined";
}

export function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function isValueOf(obj, value) {
  return Object.values(obj).includes(value);
}