import { createHmac } from 'crypto'

export function verifyAppleSignature(rawBody: string, headerSignature: string | undefined, sharedSecret: string): boolean {
  if (!headerSignature) return false
  const received = headerSignature.replace(/^hmacsha256=/, "")
  const hmac = createHmac("sha256", sharedSecret)
    .update(rawBody)
    .digest("hex")
  return hmac === received
} 