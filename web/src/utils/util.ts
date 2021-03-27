export const onEnterKeyClick = <T extends HTMLDivElement = HTMLDivElement>(
  ev: React.KeyboardEvent<T>
) =>
  ev.key === "Enter" && "click" in ev.currentTarget && ev.currentTarget.click();

export const remToPx = (rem: number) =>
  (typeof getComputedStyle !== "undefined"
    ? parseInt(getComputedStyle(document.documentElement).fontSize)
    : 16) * rem;
