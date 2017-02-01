export function arrayOfLength(length) {
  return Array.apply(null, Array(length)).map(Number.call, Number);
}
