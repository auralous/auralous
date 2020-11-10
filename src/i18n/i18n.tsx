import React, { useState, useEffect, useCallback } from "react";
import i18n, { supportedLocale } from "./rosetta";
import I18nContext from "./I18nContext";
import { Locale } from "./types";

const localStorageKey = "settings.locale";

const I18n: React.FC = ({ children }) => {
  const [locale, _setLocale] = useState<Locale>(() => i18n.locale() as Locale);

  const setLocale = useCallback((l: Locale, skipLocalStorage?: boolean) => {
    i18n.locale(l);
    if (!skipLocalStorage) window.localStorage.setItem(localStorageKey, l);
    return _setLocale(l);
  }, []);

  useEffect(() => {
    let preferred = window.localStorage.getItem(
      localStorageKey
    ) as Locale | null;

    // update on first load
    if (!preferred && navigator.language)
      preferred = navigator.language.split("-")[0] as Locale;

    if (preferred && supportedLocale.includes(preferred))
      setLocale(preferred, true);
  }, [setLocale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t: (t, data) => i18n.t(t, data) || t.toString(),
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default I18n;
