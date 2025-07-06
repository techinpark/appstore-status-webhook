export const STATUS_COLORS = {
  infoColor: "#8e8e8e",
  warningColor: "#f4f124", 
  successColor1: "#1eb6fc",
  successColor2: "#14ba40",
  failureColor: "#e0143d",
} as const

export const COLOR_MAPPING: Record<string, string> = {
  "PREPARE_FOR_SUBMISSION": STATUS_COLORS.infoColor,
  "WAITING_FOR_REVIEW": STATUS_COLORS.infoColor,
  "IN_REVIEW": STATUS_COLORS.successColor1,
  "PENDING_CONTRACT": STATUS_COLORS.warningColor,
  "WAITING_FOR_EXPORT_COMPLIANCE": STATUS_COLORS.warningColor,
  "PENDING_DEVELOPER_RELEASE": STATUS_COLORS.successColor2,
  "PROCESSING_FOR_APP_STORE": STATUS_COLORS.successColor2,
  "PENDING_APPLE_RELEASE": STATUS_COLORS.successColor2,
  "READY_FOR_SALE": STATUS_COLORS.successColor2,
  "REJECTED": STATUS_COLORS.failureColor,
  "METADATA_REJECTED": STATUS_COLORS.failureColor,
  "REMOVED_FROM_SALE": STATUS_COLORS.failureColor,
  "DEVELOPER_REJECTED": STATUS_COLORS.failureColor,
  "DEVELOPER_REMOVED_FROM_SALE": STATUS_COLORS.failureColor,
  "INVALID_BINARY": STATUS_COLORS.failureColor,
}

export function getSlackColorForStatus(status: string): string {
  return COLOR_MAPPING[status] || STATUS_COLORS.infoColor
}

export function getDiscordColorForStatus(status: string): number {
  const hexColor = COLOR_MAPPING[status] || STATUS_COLORS.infoColor
  return parseInt(hexColor.replace('#', ''), 16)
} 