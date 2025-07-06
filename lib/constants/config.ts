export const CONSTANTS = {
  UNKNOWN: "unknown",
  
  // Emojis
  EMOJI_TIMESTAMP: "⏱️",
  EMOJI_PING: "📨",
  EMOJI_PAYLOAD: "🧾",
  EMOJI_ROCKET: "🚀",
  EMOJI_PING_CIRCLE: "🔄",
  EMOJI_MAILBOX: "📬",
} as const

export const HTTP_CONFIG = {
  METHOD_POST: "POST",
  CONTENT_TYPE_HEADER: "Content-Type",
  CONTENT_TYPE_JSON: "application/json",
} as const

export const CRYPTO_CONFIG = {
  HMAC_PREFIX: "hmacsha256=",
  HMAC_ALGORITHM: "sha256",
} as const

export const LOCALE_CONFIG = {
  DEFAULT_TIMEZONE: "UTC",
  DEFAULT_LOCALE: "en-US",
  DEFAULT_LANGUAGE: "en",
} as const

export const EXTERNAL_URLS = {
  APP_STORE_ICON: "https://developer.apple.com/assets/elements/icons/app-store/app-store-128x128_2x.png",
  SCHEMA_CONTEXT: "https://schema.org/extensions",
} as const 