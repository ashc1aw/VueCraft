import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'

export const availableLocales = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
] as const

export type LocaleCode = (typeof availableLocales)[number]['code']

function getInitialLocale(): LocaleCode {
  const stored = localStorage.getItem('vuecraft-locale')
  if (stored && availableLocales.some((l) => l.code === stored)) {
    return stored as LocaleCode
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: { zh, en },
})

export default i18n
