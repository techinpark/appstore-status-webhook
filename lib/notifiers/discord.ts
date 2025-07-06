import { WebhookPayload } from '../types'
import { buildDiscordMessage } from '../builders/discord'
import { getLocaleMessages } from '../utils/locale'
import { HTTP_CONFIG } from '../constants/config'

export async function sendToDiscord(payload: WebhookPayload, webhookUrl: string): Promise<void> {
  const messages = await getLocaleMessages()
  const message = await buildDiscordMessage(payload)
  if (!message) return

  try {
    const response = await fetch(webhookUrl, {
      method: HTTP_CONFIG.METHOD_POST,
      headers: { [HTTP_CONFIG.CONTENT_TYPE_HEADER]: HTTP_CONFIG.CONTENT_TYPE_JSON },
      body: JSON.stringify(message)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
  } catch (error) {
    console.error(messages.error.discord, error)
  }
} 