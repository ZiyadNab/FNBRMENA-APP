import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './en.json'
import ar from './ar.json'
import de from './de.json'
import es from './es.json'
import fr from './fr.json'
import it from './it.json'
import pl from './pl.json'
import pt from './pt.json'
import tr from './tr.json'

const LANGUAGE_STORAGE_KEY = '@app_language';

export const languageResources = {
    en: { translation: en },
    ar: { translation: ar },
    de: { translation: de },
    es: { translation: es },
    fr: { translation: fr },
    it: { translation: it },
    pl: { translation: pl },
    'pt-BR': { translation: pt },
    tr: { translation: tr },
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