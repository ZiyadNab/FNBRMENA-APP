import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json'
import ar from './ar.json'

const LANGUAGE_STORAGE_KEY = '@app_language';

export const languageResources = {
    en: { translation: en },
    ar: { translation: ar },
}

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: "v3",
        lng: "en",
        fallbackLng: 'en',
        resources: languageResources
    });

i18n.on('languageChanged', async (lng) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
        console.error('Error saving language:', error);
    }
});

export default i18n;