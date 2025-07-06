import { LOCALE_CONFIG } from '../constants/config'
import enMessages from '../locales/en.json'
import koMessages from '../locales/ko.json'

type LocaleMessages = {
  messages: Record<string, string>
  fields: Record<string, string>
  actions: Record<string, string>
  success: Record<string, string>
  error: Record<string, string>
  service: Record<string, string>
  status: Record<string, string>
}

const localeData: Record<string, LocaleMessages> = {
  en: enMessages,
  ko: koMessages
}

export async function getLocaleMessages(locale?: string): Promise<LocaleMessages> {
  const lang = locale || process.env.LANGUAGE || LOCALE_CONFIG.DEFAULT_LANGUAGE
  return localeData[lang] || localeData.en
}

export async function t(key: string, category: keyof LocaleMessages = 'messages', locale?: string): Promise<string> {
  const messages = await getLocaleMessages(locale)
  return messages[category]?.[key] || key
} 