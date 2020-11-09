import React, { useState, useEffect } from "react";
import i18n from "./rosetta";
import I18nContext from "./I18nContext";
import { Lang } from "./types";

const I18n: React.FC = ({ children }) => {
  const [locale, setLocale] = useState<Lang>(() => i18n.locale() as Lang);

  // when locale is updated
  useEffect(() => {
    i18n.locale(locale);
  }, [locale]);

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
