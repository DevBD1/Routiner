import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import tr from './locales/tr.json';

const i18n = new I18n({
  en,
  tr,
});

i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;