export function parseMs(
  ms: number,
  prettyString?: boolean,
  includeHour?: boolean
) {
  let second: number | string = Math.floor(ms / 1000);
  let minute: number | string = Math.floor(second / 60);
  let hour: number | string | undefined;
  second %= 60;
  if (includeHour) {
    hour = Math.floor(minute / 60);
    minute %= 60;
  }
  if (prettyString) second = second >= 10 ? second : `0${second}`;
  if (prettyString && includeHour)
    minute = minute >= 10 ? minute : `0${minute}`;
  return [second, minute, hour];
}
