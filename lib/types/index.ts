export interface Env {
  SHARED_SECRET?: string
  SLACK_WEBHOOK_URL?: string
  DISCORD_WEBHOOK_URL?: string
  TEAMS_WEBHOOK_URL?: string
  APP_STORE_URL?: string
  TIMEZONE?: string
  LANGUAGE?: string
  ENABLE_APP_STORE_API?: string
  APP_STORE_CONNECT_KEY_ID?: string
  APP_STORE_CONNECT_ISSUER_ID?: string
  APP_STORE_CONNECT_PRIVATE_KEY_PATH?: string
  APP_STORE_CONNECT_PRIVATE_KEY?: string
}

export interface WebhookPayload {
  data: {
    type: string
    id: string
    version: number
    attributes: {
      newValue?: string
      oldValue?: string
      timestamp: string
    }
    relationships?: {
      instance?: {
        data: {
          type: string
          id: string
        }
        links: {
          self: string
        }
      }
    }
  }
}

export interface AppStoreVersionResponse {
  data: {
    type: string
    id: string
    attributes: {
      versionString: string
      appStoreState: string
      storeIcon?: string
      reviewType?: string
      releaseType?: string
      earliestReleaseDate?: string
      downloadable?: boolean
      createdDate: string
      copyright?: string
    }
    relationships?: {
      app?: {
        data: {
          type: string
          id: string
        }
        links: {
          self: string
        }
      }
      appStoreVersionLocalizations?: {
        data: Array<{
          type: string
          id: string
        }>
      }
    }
  }
  included?: Array<{
    type: string
    id: string
    attributes: any
  }>
}

export interface AppResponse {
  data: {
    type: string
    id: string
    attributes: {
      name: string
      bundleId: string
      sku: string
      primaryLocale: string
      isOrEverWasMadeForKids: boolean
      subscriptionStatusUrl?: string
      subscriptionStatusUrlVersion?: string
      subscriptionStatusUrlForSandbox?: string
      subscriptionStatusUrlVersionForSandbox?: string
      availableInNewTerritories?: boolean
    }
  }
}

export interface AppInfo {
  id: string
  name: string
  bundleId: string
  version: string
  appStoreState: string
  appStoreUrl?: string
}

export interface NotificationData {
  type: string
  id: string
  timestamp: string
  newValue?: string
  oldValue?: string
  appInfo?: AppInfo
} 