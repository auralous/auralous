import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules, Platform } from "react-native";
import { ArrayElement } from "utils/types";
import create from "zustand";
import i18n, { supportedLocales } from "./rosetta";

const deviceLanguage: string =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

type SupportedLocales = ArrayElement<typeof supportedLocales>;

const STORAGE_KEY = "settings.locale";

const useStore = create<{
  locale: SupportedLocales;
  setLocale(newLocale: SupportedLocales): void;
  i18n: typeof i18n;
  t: typeof i18n["t"];
}>((set) => {
  const preferredLocale = deviceLanguage.split("_")[0] as SupportedLocales;

  const locale: SupportedLocales = supportedLocales.includes(preferredLocale)
    ? preferredLocale
    : "en";

  AsyncStorage.getItem(STORAGE_KEY).then(
    (savedLocale) =>
      savedLocale && set({ locale: savedLocale as SupportedLocales })
  );

  return {
    locale,
    setLocale: (locale: SupportedLocales) => {
      AsyncStorage.setItem(STORAGE_KEY, locale);
      i18n.locale(locale);
      set({ locale });
    },
    i18n,
    t: i18n.t,
  };
});

export function useTranslation() {
  return useStore((state) => state);
}
