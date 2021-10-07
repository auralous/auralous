/**
 * Function that returns its own input
 */
export const identityFn = <T>(val: T): T => val;

export function isTruthy<T>(x?: T | null | undefined | false): x is T {
  return !!x;
}

export function isTouchDevice() {
  if (typeof window === "undefined" || typeof navigator === "undefined")
    return true;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
