export interface SiteConfig {
  key: string
  value: string
  groupName: string
  description?: string
  dataType: 'string' | 'number' | 'boolean' | 'json'
  isPublic: boolean
  isEncrypted: boolean
  sortOrder: number
}
