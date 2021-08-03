/**
 * Shuffle by mutating the input arrays
 * @param arr
 * @returns
 */
export function shuffle<T>(arr: T[]): T[] {
  // https://bost.ocks.org/mike/shuffle/
  let m = arr.length;
  let t: T;
  let i: number;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

/**
 * Reorder an array without mutation
 * @param list
 * @param startIndex
 * @param endIndex
 * @returns
 */
export function reorder<T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
