import { IntegrityEvent } from './IntegrityEvent'
import { AbstractService } from '../Service/AbstractService'
import { IntegrityApiInterface } from '../Integrity/IntegrityApiInterface'
import { ItemManagerInterface } from '../Item/ItemManagerInterface'
import { GetSingleItemResponse, HttpResponse, PayloadSource } from '@standardnotes/common'
import { ItemApiInterface } from '../Item/ItemApiInterface'

export class IntegrityService extends AbstractService<IntegrityEvent> {
  constructor(
    private integrityApi: IntegrityApiInterface,
    private itemApi: ItemApiInterface,
    private itemManager: ItemManagerInterface,
  ) {
    super()

    this.addObservers()
  }

  deinit(): void {
    super.deinit()
  }

  private async handleSyncEvent() {
    const integrityCheckResponse = await this.integrityApi.checkIntegrity(this.itemManager.integrityPayloads)
    if (integrityCheckResponse.data === undefined || integrityCheckResponse.error) {
      this.log(`Could not obtain integrity check: ${integrityCheckResponse?.error?.message}`)

      throw new Error('Could not obtain integrity check')
    }

    const serverItemResponsePromises: Promise<HttpResponse | GetSingleItemResponse>[] = []
    if ('mismatches' in integrityCheckResponse.data && integrityCheckResponse?.data?.mismatches.length > 0) {
      for (const mismatch of integrityCheckResponse.data.mismatches) {
        serverItemResponsePromises.push(this.itemApi.getSingleItem(mismatch.uuid))
      }
    }

    const serverItemResponses = await Promise.all(serverItemResponsePromises)

    for (const serverItemResponse of serverItemResponses) {
      if (serverItemResponse.data === undefined || serverItemResponse.error || !('item' in serverItemResponse.data)) {
        this.log(`Could not obtain item for integrity adjustments: ${serverItemResponse?.error?.message}`)

        throw new Error('Could not obtain item for integrity adjustments')
      }

      void this.itemManager.emitItemFromPayload(
        CreateMaxPayloadFromAnyObject(serverItemResponse.data.item),
        PayloadSource.RemoteRetrieved,
      )
    }

    void this.notifyEvent(IntegrityEvent.IntegrityCheckCompleted)
  }

  private addObservers(): void {
    return
  }
}
