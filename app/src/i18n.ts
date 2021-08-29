import en from "@auralous/locales/src/en.json";
import vi from "@auralous/locales/src/vi.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Resource } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";

const resources: Resource = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

export const supportedLanguages = Object.keys(resources);

i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

AsyncStorage.getItem("settings/language").then((value) => {
  if (value) i18n.changeLanguage(value);
});

export default i18n;
