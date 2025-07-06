import { NotificationData } from '../types/index.js'
import { getAppStoreStatusLabel, getStatusEmoji } from '../utils/status.js'
import { formatTimestamp } from '../utils/timestamp.js'
import { getLocaleMessages } from '../utils/locale.js'
import { getSlackColorForStatus } from '../utils/color.js'
import { CONSTANTS } from '../constants/config.js'

export async function buildSlackMessage(notificationData: NotificationData): Promise<any> {
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
          title: messages.fields.currentStatus,
          value: `${getStatusEmoji(newValue)} ${await getAppStoreStatusLabel(newValue, locale)}`,
          short: true,
        },
        {
          title: messages.fields.previousStatus,
          value: await getAppStoreStatusLabel(oldValue, locale),
          short: true,
        }
      ]

      // Add app information if available
      if (appInfo) {
        fields.push(
          {
            title: "App Name",
            value: appInfo.name,
            short: true,
          },
          {
            title: "Version",
            value: appInfo.version,
            short: true,
          },
          {
            title: "Bundle ID",
            value: appInfo.bundleId,
            short: true,
          }
        )
      } else {
        fields.push({
          title: messages.fields.versionId,
          value: notificationData.id,
          short: true,
        })
      }

      const attachment = {
        fallback: `${messages.messages.appVersionStatusUpdated}: ${newValue}`,
        color: getSlackColorForStatus(newValue),
        title: appInfo?.name || "App Store Connect",
        title_link: appInfo?.appStoreUrl || APP_STORE_URL || undefined,
        fields,
        footer: "appstore-status-webhook",
        footer_icon: "https://img.icons8.com/?size=30&id=62856&format=png",
        ts: Math.floor(new Date(rawTimestamp).getTime() / 1000),
      }

      return { attachments: [attachment] }
    },

    webhookPingCreated: async () => ({
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: messages.messages.webhookTestPing,
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*${messages.fields.pingId}:*\n${notificationData.id}`,
            },
            {
              type: "mrkdwn",
              text: `*${messages.fields.timestamp}:*\n${timestamp}`,
            },
          ],
        },
      ],
    }),

    webhookPings: async () => null,
  }

  const template = await (events[type]?.() ?? (async () => {
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${messages.messages.unhandledAppStoreEvent}: ${type}`,
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "```json\n" + JSON.stringify(notificationData, null, 2) + "\n```",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `${CONSTANTS.EMOJI_TIMESTAMP} *${messages.fields.timestamp}:* ${timestamp}`,
            },
          ],
        },
      ],
    }
  })())

  return template
} 