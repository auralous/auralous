import en from "@auralous/locales/src/en.json";
import vi from "@auralous/locales/src/vi.json";
import type { Resource } from "i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources: Resource = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

export const supportedLanguages = Object.keys(resources);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
