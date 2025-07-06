import type { VercelRequest, VercelResponse } from '@vercel/node'
import { WebhookPayload } from '../lib/types'
import { verifyAppleSignature } from '../lib/utils/signature'
import { sendToSlack } from '../lib/notifiers/slack'
import { sendToDiscord } from '../lib/notifiers/discord'

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

    const promises = []
    
    if (process.env.SLACK_WEBHOOK_URL) {
      promises.push(sendToSlack(payload, process.env.SLACK_WEBHOOK_URL))
    }
    
    if (process.env.DISCORD_WEBHOOK_URL) {
      promises.push(sendToDiscord(payload, process.env.DISCORD_WEBHOOK_URL))
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