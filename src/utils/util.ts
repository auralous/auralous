export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function defaultAvatar(str: string) {
  return `https://avatar.tobi.sh/${str}`;
}

export const onEnterKeyClick = <T extends HTMLDivElement = HTMLDivElement>(
  ev: React.KeyboardEvent<T>
) =>
  ev.key === "Enter" && "click" in ev.currentTarget && ev.currentTarget.click();

export const remToPx = (rem: number) =>
  (typeof getComputedStyle !== "undefined"
    ? parseInt(getComputedStyle(document.documentElement).fontSize)
    : 16) * rem;
