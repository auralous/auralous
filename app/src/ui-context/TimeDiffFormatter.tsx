import type { FC } from "react";
import { createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";

type TimeDiffFormatterFns = (date: Date) => string;

const TimeDiffFormatterContext = createContext<TimeDiffFormatterFns>(() => "");

const SEC = 1e3,
  MIN = SEC * 60,
  HOUR = MIN * 60,
  DAY = HOUR * 24;

export const TimeDiffFormatterProvider: FC = ({ children }) => {
  const { i18n } = useTranslation();

  const fn = useMemo<TimeDiffFormatterFns>(() => {
    const today = new Date();
    let rtf: {
      format(value: number, unit: Intl.RelativeTimeFormatUnit): string;
    };
    if (Intl.RelativeTimeFormat) {
      rtf = new Intl.RelativeTimeFormat(i18n.language, { style: "long" });
    } else {
      rtf = {
        format(value, unit) {
          return i18n.t("common.time.ago", {
            time: i18n.t(`common.time.x_${unit}`, { count: Math.abs(value) }),
          });
        },
      };
    }

    const dtf = new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      day: "numeric",
    });
    return (d) => {
      const num = today.getTime() - d.getTime();
      if (num < SEC) return i18n.t("common.time.just_now");
      if (num < MIN) return rtf.format(-Math.round(num / SEC), "second");

      if (num < HOUR) return rtf.format(-Math.round(num / MIN), "minute");
      if (num < DAY) return rtf.format(-Math.round(num / HOUR), "hour");
      if (num < 7 * DAY) return rtf.format(-Math.round(num / DAY), "day");
      return dtf.format(d);
    };
  }, [i18n]);

  return (
    <TimeDiffFormatterContext.Provider value={fn}>
      {children}
    </TimeDiffFormatterContext.Provider>
  );
};

export const useTimeDiffFormatter = () => useContext(TimeDiffFormatterContext);
