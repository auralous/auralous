import i18n, { supportedLocale } from "./rosetta";

export type Locale = typeof supportedLocale[number];

export interface I18NContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof i18n.t;
}
