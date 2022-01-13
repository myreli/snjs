import { SNItem } from './item';

export interface ItemDelta {
  changed: SNItem[];
  inserted: SNItem[];
  discarded: SNItem[];
  ignored: SNItem[];
}

// Make the concept of index / caching explicit and force our
// indexes to be structurally similar.
// This is not too early because we know we are building a database
// and we'll need index.
// We also know we're are building a note taking state management app
// and we'll soon want to split both layers to make them easier to understand and
// update.
export interface SNIndex {
  onChange(delta: ItemDelta): void;
}
