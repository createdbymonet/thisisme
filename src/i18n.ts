import en from './locales/en.json' with { type: 'json' }
import ja from './locales/ja.json' with { type: 'json' }
import type { SupportedLanguage } from './config/appSettings'

export type TranslationKey = keyof typeof en

const translations: Record<SupportedLanguage, Record<TranslationKey, string>> = { en, ja }

export function translate(language: SupportedLanguage, key: TranslationKey) {
  return translations[language][key]
}
