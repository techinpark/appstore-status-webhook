import { AppStoreVersionResponse, AppResponse, AppInfo } from '../types/index.js'
import jwt from 'jsonwebtoken'
import { readFileSync } from 'fs'

export class AppStoreConnectService {
  private static readonly API_BASE_URL = 'https://api.appstoreconnect.apple.com/v1'
  private static readonly TOKEN_EXPIRY = 20 * 60 // 20 minutes

  /**
   * Generate JWT token for App Store Connect API authentication
   */
  private static generateJWT(): string | null {
    try {
      const keyId = process.env.APP_STORE_CONNECT_KEY_ID
      const issuerId = process.env.APP_STORE_CONNECT_ISSUER_ID
      const privateKeyPath = process.env.APP_STORE_CONNECT_PRIVATE_KEY_PATH
      const privateKeyContent = process.env.APP_STORE_CONNECT_PRIVATE_KEY

      if (!keyId || !issuerId) {
        console.error('Missing required App Store Connect API credentials')
        return null
      }

      let privateKey: string

      if (privateKeyContent) {
        // Use private key from environment variable
        privateKey = privateKeyContent.replace(/\\n/g, '\n')
      } else if (privateKeyPath) {
        // Read private key from file
        privateKey = readFileSync(privateKeyPath, 'utf8')
      } else {
        console.error('No private key provided')
        return null
      }

      const now = Math.floor(Date.now() / 1000)
      const payload = {
        iss: issuerId,
        iat: now,
        exp: now + this.TOKEN_EXPIRY,
        aud: 'appstoreconnect-v1'
      }

      return jwt.sign(payload, privateKey, {
        algorithm: 'ES256',
        header: {
          kid: keyId,
          typ: 'JWT',
          alg: 'ES256'
        }
      })
    } catch (error) {
      console.error('Failed to generate JWT token:', error)
      return null
    }
  }

  /**
   * Check if App Store Connect API is enabled
   */
  private static isApiEnabled(): boolean {
    return process.env.ENABLE_APP_STORE_API === 'true'
  }

  /**
   * Get headers for App Store Connect API requests
   */
  private static getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'AppStoreWebhook/1.0'
    }

    if (this.isApiEnabled()) {
      const token = this.generateJWT()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Fetch app store version information from the API
   */
  static async fetchAppStoreVersion(versionId: string): Promise<AppStoreVersionResponse | null> {
    if (!this.isApiEnabled()) {
      console.log('App Store Connect API is disabled')
      return null
    }

    try {
      const url = `${this.API_BASE_URL}/appStoreVersions/${versionId}?include=app`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        console.error(`Failed to fetch app store version: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data as AppStoreVersionResponse
    } catch (error) {
      console.error('Error fetching app store version:', error)
      return null
    }
  }

  /**
   * Fetch app information from the API
   */
  static async fetchApp(appId: string): Promise<AppResponse | null> {
    if (!this.isApiEnabled()) {
      console.log('App Store Connect API is disabled')
      return null
    }

    try {
      const url = `${this.API_BASE_URL}/apps/${appId}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        console.error(`Failed to fetch app: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()
      return data as AppResponse
    } catch (error) {
      console.error('Error fetching app:', error)
      return null
    }
  }

  /**
   * Extract app information from webhook payload and API responses
   */
  static async getAppInfoFromPayload(payload: any): Promise<AppInfo | null> {
    try {
      // Try to get app store version ID from payload
      const versionId = payload.data?.relationships?.instance?.data?.id
      if (!versionId) {
        console.warn('No version ID found in payload')
        return null
      }

      // Fetch app store version info
      const versionResponse = await this.fetchAppStoreVersion(versionId)
      if (!versionResponse) {
        return null
      }

      const version = versionResponse.data.attributes.versionString
      const appStoreState = versionResponse.data.attributes.appStoreState
      const appId = versionResponse.included?.[0]?.id

      // If we have app info in included section, use it
      if (versionResponse.included?.[0]?.attributes) {
        const appAttributes = versionResponse.included[0].attributes
        return {
          id: appId || 'unknown',
          name: appAttributes.name || 'Unknown App',
          bundleId: appAttributes.bundleId || 'unknown',
          version: version || 'unknown',
          appStoreState: appStoreState || 'unknown'
        }
      }

      // Otherwise, fetch app info separately
      if (appId) {
        const appResponse = await this.fetchApp(appId)
        if (appResponse) {
          return {
            id: appId,
            name: appResponse.data.attributes.name || 'Unknown App',
            bundleId: appResponse.data.attributes.bundleId || 'unknown',
            version: version || 'unknown',
            appStoreState: appStoreState || 'unknown'
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error extracting app info from payload:', error)
      return null
    }
  }
} 