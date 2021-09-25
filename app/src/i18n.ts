import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Resource } from "i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "react-native-localize";
import en from "../locales/en.json";
import vi from "../locales/vi.json";
import { STORAGE_KEY_SETTINGS_LANGUAGE } from "./utils/constants";

const resources: Resource = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

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

export const getPreferredLanguage = () =>
  AsyncStorage.getItem(STORAGE_KEY_SETTINGS_LANGUAGE).then(
    (value) => value || undefined
  );

getPreferredLanguage().then((value) => {
  value && i18n.changeLanguage(value);
});

export default i18n;
