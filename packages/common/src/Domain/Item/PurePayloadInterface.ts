import { Uuid } from '../DataType/Uuid'
import { ContentReference } from '../Item/ContentReference'
import { PayloadContent } from '../Item/PayloadContent'
import { RawPayload } from '../Item/RawPayload'

export interface PurePayloadInterface {
  safeContent: PayloadContent
  references: ContentReference[]
  safeReferences: ContentReference[]
  contentObject: PayloadContent
  contentString: string
  discardable: boolean
  serverUpdatedAt: Date
  serverUpdatedAtTimestamp: number | undefined
  ejected(): RawPayload
  getReference(uuid: Uuid): ContentReference
}
