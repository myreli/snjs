import { ContentType } from '../Content/ContentType'
import { ContentReferenceType } from './ContentReferenceType'

export interface AnonymousReference {
  uuid: string;
  content_type: ContentType
  reference_type: ContentReferenceType
}
