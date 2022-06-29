import { initReactI18next } from "react-i18next";
import i18n from "i18next";
// @ts-ignore
import { messages } from "vite-i18n-resources";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: messages,
    lng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
