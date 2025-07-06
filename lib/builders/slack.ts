import { WebhookPayload } from '../types'
import { getAppStoreStatusLabel, getStatusEmoji } from '../utils/status'
import { formatTimestamp } from '../utils/timestamp'
import { getLocaleMessages } from '../utils/locale'
import { getSlackColorForStatus } from '../utils/color'
import { CONSTANTS } from '../constants/config'

export async function buildSlackMessage(payload: WebhookPayload): Promise<any> {
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

      const attachment = {
        fallback: `${messages.messages.appVersionStatusUpdated}: ${newValue}`,
        color: getSlackColorForStatus(newValue),
        title: "App Store Connect",
        title_link: APP_STORE_URL || undefined,
        fields: [
          {
            title: messages.fields.currentStatus,
            value: `${getStatusEmoji(newValue)} ${await getAppStoreStatusLabel(newValue, locale)}`,
            short: true,
          },
          {
            title: messages.fields.previousStatus,
            value: await getAppStoreStatusLabel(oldValue, locale),
            short: true,
          },
          {
            title: messages.fields.versionId,
            value: versionId,
            short: true,
          },
        ],
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
              text: `*${messages.fields.pingId}:*\n${payload.data.id}`,
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
            text: "```json\n" + JSON.stringify(payload, null, 2) + "\n```",
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