import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import vi from "../locales/vi.json";

export const resources: Resource = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;