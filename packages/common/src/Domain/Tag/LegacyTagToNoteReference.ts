import { ContentType } from '../Content/ContentType'
import { LegacyAnonymousReference } from '../Item/LegacyAnonymousReference'

export interface LegacyTagToNoteReference extends LegacyAnonymousReference {
  content_type: ContentType.Note
}
