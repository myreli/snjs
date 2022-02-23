import { PayloadSource } from '@standardnotes/common';

/**
 * Whether the changed payload represents only an internal change that shouldn't
 * require a UI refresh
 */
export function isPayloadSourceInternalChange(source: PayloadSource) {
  return [PayloadSource.RemoteSaved, PayloadSource.PreSyncSave].includes(
    source
  );
}

export function isPayloadSourceRetrieved(source: PayloadSource) {
  return [
    PayloadSource.RemoteRetrieved,
    PayloadSource.ComponentRetrieved,
    PayloadSource.RemoteActionRetrieved,
  ].includes(source);
}
