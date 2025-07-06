export interface Env {
  SHARED_SECRET?: string
  SLACK_WEBHOOK_URL?: string
  DISCORD_WEBHOOK_URL?: string
  TEAMS_WEBHOOK_URL?: string
  APP_STORE_URL?: string
  TIMEZONE?: string
}

export interface WebhookPayload {
  data: {
    type: string
    id: string
    attributes: {
      timestamp: string
      newValue?: string
      oldValue?: string
    }
    relationships?: {
      instance?: {
        data: {
          id: string
        }
      }
    }
  }
} 