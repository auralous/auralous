import React from "react";
import i18n from "./rosetta";

export type Lang = "en" | "vi";

export interface I18NContextValue {
  locale: Lang;
  setLocale: React.Dispatch<React.SetStateAction<Lang>>;
  t: typeof i18n.t;
}
