const SEC = 1e3,
  MIN = SEC * 60,
  HOUR = MIN * 60,
  DAY = HOUR * 24,
  YEAR = DAY * 365.25;

function fmt(val: number, str: string, long?: boolean) {
  const num = (val | 0) === val ? val : ~~(val + 0.5);
  return num + (long ? " " + str + (num != 1 ? "s" : "") : str[0]);
}

export function format(
  t: typeof import("./i18n/index").t,
  num: number,
  long?: boolean
) {
  if (num < SEC) return num + (long ? " ms" : "ms");
  if (num < MIN) return fmt(num / SEC, "second", long);
  if (num < HOUR) return fmt(num / MIN, "minute", long);
  if (num < DAY) return fmt(num / HOUR, "hour", long);
  if (num < YEAR) return fmt(num / DAY, "day", long);
  return fmt(num / YEAR, "year", long);
}
