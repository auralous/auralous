import { useEffect, useRef } from "react";

// Optimize
function debounce(fn: () => void, ms: number) {
  let timer: number | undefined;
  return () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      fn();
    }, ms);
  };
}

export function useInnerHeightResizeRef() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const divRef = ref.current;
    if (!divRef) return;
    divRef.style.height = `${window.innerHeight}px`;
    // Some debouce to avoid perf issues
    const onResize = debounce(
      () => (divRef.style.height = `${window.innerHeight}px`),
      250
    );
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return ref;
}
