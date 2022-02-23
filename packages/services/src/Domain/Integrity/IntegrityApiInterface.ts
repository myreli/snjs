import { IntegrityPayload, CheckIntegrityResponse, HttpResponse } from '@standardnotes/common'

export interface IntegrityApiInterface {
  checkIntegrity(integrityPayloads: IntegrityPayload[]): Promise<CheckIntegrityResponse | HttpResponse>
}
