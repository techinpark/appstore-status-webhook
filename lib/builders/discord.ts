import { NotificationData } from '../types/index.js'
import { getAppStoreStatusLabel, getStatusEmoji } from '../utils/status.js'
import { formatTimestamp } from '../utils/timestamp.js'
import { getLocaleMessages } from '../utils/locale.js'
import { getDiscordColorForStatus } from '../utils/color.js'
import { CONSTANTS } from '../constants/config.js'

export async function buildDiscordMessage(notificationData: NotificationData): Promise<any> {
  const locale = process.env.LANGUAGE || 'en'
  const messages = await getLocaleMessages(locale)
  
  const type = notificationData.type || CONSTANTS.UNKNOWN
  const rawTimestamp = notificationData.timestamp || new Date().toISOString()
  const timestamp = formatTimestamp(rawTimestamp)
  const APP_STORE_URL = process.env.APP_STORE_URL || null

  const events: Record<string, () => Promise<any>> = {
    appStoreVersionAppVersionStateUpdated: async () => {
      const newValue = notificationData.newValue!
      const oldValue = notificationData.oldValue!
      const appInfo = notificationData.appInfo

      const fields = [
        {
          name: messages.fields.currentStatus,
          value: `${getStatusEmoji(newValue)} ${await getAppStoreStatusLabel(newValue, locale)}`,
          inline: true,
        },
        {
          name: messages.fields.previousStatus,
          value: await getAppStoreStatusLabel(oldValue, locale),
          inline: true,
        }
      ]

      // Add app information if available
      if (appInfo) {
        fields.push(
          {
            name: "App Name",
            value: appInfo.name,
            inline: true,
          },
          {
            name: "Version",
            value: appInfo.version,
            inline: true,
          },
          {
            name: "Bundle ID",
            value: appInfo.bundleId,
            inline: true,
          }
        )
      } else {
        fields.push({
          name: messages.fields.versionId,
          value: notificationData.id,
          inline: true,
        })
      }

      const embed = {
        title: appInfo?.name || "App Store Connect",
        url: appInfo?.appStoreUrl || APP_STORE_URL || undefined,
        color: getDiscordColorForStatus(newValue),
        fields,
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
            value: notificationData.id,
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
      description: `\`\`\`json\n${JSON.stringify(notificationData, null, 2)}\n\`\`\``,
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