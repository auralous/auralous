import { t } from "i18next";

const SEC = 1e3,
  MIN = SEC * 60,
  HOUR = MIN * 60,
  DAY = HOUR * 24,
  YEAR = DAY * 365.25;

export function formatTime(num: number) {
  if (num < SEC) return num + " ms";
  if (num < MIN)
    return t("common.time.x_second", { count: Math.round(num / SEC) });

  if (num < HOUR)
    return t("common.time.x_minute", { count: Math.round(num / MIN) });
  if (num < DAY)
    return t("common.time.x_hour", { count: Math.round(num / HOUR) });
  if (num < YEAR)
    return t("common.time.x_day", { count: Math.round(num / DAY) });
}

export function msToHMS(
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
