import { t } from './locale'
import { statusEmojis } from '../constants/status'

export async function getAppStoreStatusLabel(code: string, language?: string): Promise<string> {
  return await t(code, 'status', language)
}

export function getStatusEmoji(code: string): string {
  return statusEmojis[code] || "📦"
} 