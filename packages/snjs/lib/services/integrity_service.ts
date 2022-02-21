import { SNSyncService, SyncSources } from './sync/sync_service';
import { SyncEvent } from './sync/events';
import { SNApiService } from './api/api_service';
import { PureService } from './pure_service';
import { SyncResponse } from './sync/response';
import { ItemManager } from './item_manager';
import { CreateMaxPayloadFromAnyObject } from '@Lib/protocol/payloads/generator';
import { PayloadSource } from '@Payloads/sources';
import { GetSingleItemResponse, HttpResponse } from './api/responses';

export const enum IntegrityEvent {
  IntegrityCheckCompleted = 'IntegrityCheckCompleted',
}

export class SNIntegrityService extends PureService<IntegrityEvent> {
  private removeSyncObserver!: () => void;

  constructor(
    private apiService: SNApiService,
    private syncService: SNSyncService,
    private itemManager: ItemManager,
  ) {
    super();

    this.addObservers();
  }

  deinit(): void {
    (this.apiService as unknown) = undefined;
    (this.syncService as unknown) = undefined;
    (this.itemManager as unknown) = undefined;
    this.removeSyncObserver();
    (this.removeSyncObserver as unknown) = undefined;

    super.deinit();
  }

  private addObservers(): void {
    this.removeSyncObserver = this.syncService.addEventObserver(
      async (eventName: SyncEvent, eventData?: SyncResponse | { source: SyncSources, needsIntegrityCheck: boolean }) => {
        if (
          eventData !== undefined && 'needsIntegrityCheck' in eventData && eventData.needsIntegrityCheck &&
          [SyncEvent.DownloadFirstSyncCompleted, SyncEvent.FullSyncCompleted].includes(eventName)
        ) {
          const integrityCheckResponse = await this.apiService.checkIntegrity(this.itemManager.integrityHashes);
          if (integrityCheckResponse.data === undefined || integrityCheckResponse.error) {
            this.log(`Could not obtain integrity check: ${integrityCheckResponse?.error?.message}`);

            throw new Error('Could not obtain integrity check');
          }

          const serverItemResponsePromises: Promise<HttpResponse | GetSingleItemResponse>[] = []
          if ('mismatches' in integrityCheckResponse.data && integrityCheckResponse?.data?.mismatches.length > 0) {
            for (const mismatch of integrityCheckResponse.data.mismatches) {
              serverItemResponsePromises.push(this.apiService.getSingleItem(mismatch.uuid))
            }
          }

          const serverItemResponses = await Promise.all(serverItemResponsePromises)

          for (const serverItemResponse of serverItemResponses) {
            if (serverItemResponse.data === undefined || serverItemResponse.error || !('item' in serverItemResponse.data)) {
              this.log(`Could not obtain item for integrity adjustments: ${serverItemResponse?.error?.message}`);

              throw new Error('Could not obtain item for integrity adjustments');
            }

            this.itemManager.emitItemFromPayload(
              CreateMaxPayloadFromAnyObject(serverItemResponse.data.item),
              PayloadSource.RemoteRetrieved,
            )
          }

          this.notifyEvent(IntegrityEvent.IntegrityCheckCompleted);
        }
      }
    );
  }
}
