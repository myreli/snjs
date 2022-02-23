import { IntegrityPayload } from '../Item/IntegrityPayload'
import { MinimalHttpResponse } from './MinimalHttpResponse'

export type CheckIntegrityResponse = MinimalHttpResponse & {
  data: {
    mismatches: IntegrityPayload[]
  }
}
