import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import uz from "./locales/uz.json";
import ru from "./locales/ru.json";

const resources = {
  en: {
    translation: en
  },
  uz: {
    translation: uz
  },
  ru: {
    translation: ru
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;