import {
  IntersectionOptions,
  useInView as useInViewHook,
} from "react-intersection-observer";

export function useInView(options?: IntersectionOptions) {
  const hookResult = useInViewHook(options);
  if (typeof IntersectionObserver === "undefined") {
    return {
      ref: undefined,
      inView: true,
    };
  }
  return hookResult;
}
