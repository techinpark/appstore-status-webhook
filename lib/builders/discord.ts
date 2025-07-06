import { WebhookPayload } from '../types'
import { getAppStoreStatusLabel, getStatusEmoji } from '../utils/status'
import { formatTimestamp } from '../utils/timestamp'
import { getLocaleMessages } from '../utils/locale'
import { getDiscordColorForStatus } from '../utils/color'
import { CONSTANTS } from '../constants/config'

export async function buildDiscordMessage(payload: WebhookPayload): Promise<any> {
  const locale = process.env.LANGUAGE || 'en'
  const messages = await getLocaleMessages(locale)
  
  const type = payload.data?.type || CONSTANTS.UNKNOWN
  const rawTimestamp = payload.data?.attributes?.timestamp || new Date().toISOString()
  const timestamp = formatTimestamp(rawTimestamp)
  const APP_STORE_URL = process.env.APP_STORE_URL || null

  const events: Record<string, () => Promise<any>> = {
    appStoreVersionAppVersionStateUpdated: async () => {
      const newValue = payload.data.attributes.newValue!
      const oldValue = payload.data.attributes.oldValue!
      const versionId = payload?.data?.relationships?.instance?.data?.id

      const embed = {
        title: "App Store Connect",
        url: APP_STORE_URL || undefined,
        color: getDiscordColorForStatus(newValue),
        fields: [
          {
            name: messages.fields.currentStatus,
            value: `${getStatusEmoji(newValue)} ${await getAppStoreStatusLabel(newValue, locale)}`,
            inline: true,
          },
          {
            name: messages.fields.previousStatus,
            value: await getAppStoreStatusLabel(oldValue, locale),
            inline: true,
          },
          {
            name: messages.fields.versionId,
            value: versionId,
            inline: true,
          },
        ],
        footer: {
          text: "appstore-status-webhook",
          icon_url: "https://img.icons8.com/?size=30&id=62856&format=png",
        },
        timestamp: new Date(rawTimestamp).toISOString(),
      }

      return { embeds: [embed] }
    },

    webhookPingCreated: async () => {
      const embed = {
        title: messages.messages.webhookTestPing,
        color: 0x1eb6fc,
        fields: [
          {
            name: messages.fields.pingId,
            value: payload.data.id,
            inline: true,
          },
          {
            name: messages.fields.timestamp,
            value: timestamp,
            inline: true,
          },
        ],
        footer: {
          text: "appstore-status-webhook",
          icon_url: "https://img.icons8.com/?size=30&id=62856&format=png",
        },
        timestamp: new Date(rawTimestamp).toISOString(),
      }

      return { embeds: [embed] }
    },

    webhookPings: async () => null,
  }

  const template = await (events[type]?.() ?? (async () => {
    const embed = {
      title: `${messages.messages.unhandledAppStoreEvent}: ${type}`,
      color: 0x8e8e8e,
      description: `\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``,
      footer: {
        text: "appstore-status-webhook",
        icon_url: "https://img.icons8.com/?size=30&id=62856&format=png",
      },
      timestamp: new Date(rawTimestamp).toISOString(),
    }

    return { embeds: [embed] }
  })())

  return template
} 