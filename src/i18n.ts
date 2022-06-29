import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import { messages } from "vite-i18n-resources";

console.log(messages);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: messages,
    lng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
