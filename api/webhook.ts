import type { VercelRequest, VercelResponse } from '@vercel/node'
import { WebhookPayload, NotificationData } from '../lib/types/index.js'
import { verifyAppleSignature } from '../lib/utils/signature.js'
import { AppStoreConnectService } from '../lib/services/appstore.js'
import { sendToSlack } from '../lib/notifiers/slack.js'
import { sendToDiscord } from '../lib/notifiers/discord.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {

    const rawBody = await new Promise<string>((resolve) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        resolve(body)
      })
    })

    if (process.env.SHARED_SECRET) {
      const signatureHeader = req.headers['x-apple-signature'] as string
      
      if (!verifyAppleSignature(rawBody, signatureHeader, process.env.SHARED_SECRET)) {
        return res.status(401).json({ error: 'Invalid signature' })
      }
    }

    
    const payload: WebhookPayload = JSON.parse(rawBody)

    // Extract notification data
    const notificationData: NotificationData = {
      type: payload.data.type,
      id: payload.data.id,
      timestamp: payload.data.attributes.timestamp,
      newValue: payload.data.attributes.newValue,
      oldValue: payload.data.attributes.oldValue
    }

    // Fetch app information if available
    const instanceUrl = payload.data.relationships?.instance?.links?.self
    if (instanceUrl) {
      console.log('📱 Fetching app information from:', instanceUrl)
      const appInfo = await AppStoreConnectService.getAppInfoFromPayload(instanceUrl)
      
      if (appInfo) {
        notificationData.appInfo = appInfo
        console.log('✅ Successfully fetched app info:', {
          name: appInfo.name,
          version: appInfo.version,
          state: appInfo.appStoreState
        })
      } else {
        console.warn('⚠️ Failed to fetch app information')
      }
    }

    const promises = []
    
    if (process.env.SLACK_WEBHOOK_URL) {
      promises.push(sendToSlack(notificationData, process.env.SLACK_WEBHOOK_URL))
    }
    
    if (process.env.DISCORD_WEBHOOK_URL) {
      promises.push(sendToDiscord(notificationData, process.env.DISCORD_WEBHOOK_URL))
    }

    await Promise.all(promises)

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    console.error("❌ Error processing webhook:", error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}