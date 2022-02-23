import { PayloadSource, PurePayloadInterface, IntegrityPayload, ItemInterface } from '@standardnotes/common'

export interface ItemManagerInterface {
  integrityPayloads: IntegrityPayload[]
  emitItemFromPayload(payload: PurePayloadInterface, source: PayloadSource): Promise<ItemInterface>
}
