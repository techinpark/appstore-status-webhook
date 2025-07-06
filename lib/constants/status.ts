import { t } from '../utils/locale'

export const statusEmojis: Record<string, string> = {
  PREPARE_FOR_SUBMISSION: "📝",
  READY_FOR_REVIEW: "📤",
  WAITING_FOR_REVIEW: "⏳",
  IN_REVIEW: "🔎",
  PENDING_CONTRACT: "📄",
  PENDING_APPLE_RELEASE: "🍏",
  PENDING_DEVELOPER_RELEASE: "🚦",
  PROCESSING_FOR_APP_STORE: "⚙️",
  PROCESSING_FOR_DISTRIBUTION: "🔄",
  READY_FOR_DISTRIBUTION: "🎯",
  REJECTED: "❌",
  METADATA_REJECTED: "🛑",
  REMOVED_FROM_SALE: "📉",
  DEVELOPER_REMOVED_FROM_SALE: "📤",
  DEVELOPER_REJECTED: "🚫",
  PREORDER_READY_FOR_SALE: "🔔",
  READY_FOR_SALE: "✅",
  APPROVED: "📗",
}

export async function getAppStoreStatusLabel(code: string, language?: string): Promise<string> {
  return await t(code, 'status', language)
}

export function getStatusEmoji(code: string): string {
  return statusEmojis[code] || "📦"
} 