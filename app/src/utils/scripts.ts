export function injectScript(
  src: string,
  { defer }: { defer?: boolean } = {}
): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.querySelectorAll(`script[src="${src}"]`).length > 0) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    if (defer) script.defer = true;
    script.src = src;
    script.onload = () => resolve(false);
    document.head.append(script);
  });
}
