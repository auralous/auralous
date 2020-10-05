export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function defaultAvatar(str: string) {
  return `https://avatar.tobi.sh/${str}`;
}
