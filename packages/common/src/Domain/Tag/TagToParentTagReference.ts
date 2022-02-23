import { ContentType } from '../Content/ContentType'
import { AnonymousReference } from './AnonymousReference'
import { ContentReferenceType } from './ContentReferenceType'

export interface TagToParentTagReference extends AnonymousReference {
  content_type: ContentType.Tag
  reference_type: ContentReferenceType.TagToParentTag
}
