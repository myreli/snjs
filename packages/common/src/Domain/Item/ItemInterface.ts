/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentType } from '../Content/ContentType'
import { Uuid } from '../DataType/Uuid'
import { ContentReference } from './ContentReference'
import { PayloadContent } from './PayloadContent'

export interface ItemInterface {
  uuid: Uuid
  content: PayloadContent | string
  safeContent: PayloadContent
  references: ContentReference[]
  deleted: boolean
  content_type: ContentType
  created_at: Date
  neverSynced: boolean
  isSingleton: boolean
  isSyncable: boolean
  serverUpdatedAt?: Date
  serverUpdatedAtTimestamp?: number
  dirtiedDate?: Date
  dirty?: boolean
  errorDecrypting?: boolean
  waitingForKey?: boolean
  errorDecryptingValueChanged?: boolean
  lastSyncBegan?: Date
  lastSyncEnd?: Date
  duplicate_of?: string
  hasRelationshipWithItem(item: ItemInterface): boolean
  isItemContentEqualWith(otherItem: ItemInterface): boolean
  getDomainData(domain: string): undefined | Record<string, any>
}
