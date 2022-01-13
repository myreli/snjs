import { removeFromArray } from '@Lib/utils';
import { ItemCollection } from './item_collection';
import { SNNote } from '@Lib/models';
import { SNTag } from '@Lib/index';
import { UuidString } from '@Lib/types';
import { isNote } from '@Lib/models/app/note';
import { isTag } from '@Lib/models/app/tag';
import { ItemDelta, SNIndex } from '@Lib/models/core/indexing';

/** tagUuid undefined signifies all notes count change */
export type TagNoteCountChangeObserver = (
  tagUuid: UuidString | undefined
) => void;

export class TagNotesIndex implements SNIndex {
  private tagToNotesMap: Partial<Record<UuidString, Set<UuidString>>> = {};
  private allCountableNotes = new Set<UuidString>();
  // private observers: TagNoteCountChangeObserver[] = [];

  constructor(private collection: ItemCollection) {}

  // Why here? Why not have this live in the note object? (separation of concerns)
  private isNoteCountable = (note: SNNote) => {
    return !note.archived && !note.trashed;
  };

  // We already have multiple observers and subscription workflow internally,
  // I wouldn't implement a new one immediately and first try to reuse and
  // repurpose what we already have.
  // Take this as an enterprise service bus for the API internals.
  // Commented because I operate under the assumption we already have a public API
  // to express "I want to subscribe to a tag(s) and get notified any time they change."
  //
  // public addCountChangeObserver(
  //   observer: TagNoteCountChangeObserver
  // ): () => void {
  //   this.observers.push(observer);

  //   return () => {
  //     removeFromArray(this.observers, observer);
  //   };
  // }

  // private notifyObservers(tagUuid: UuidString | undefined) {
  //   for (const observer of this.observers) {
  //     observer(tagUuid);
  //   }
  // }

  // Note this part of the API is more explicitly the Domain level operatio
  public allCountableNotesCount(): number {
    return this.allCountableNotes.size;
  }

  public countableNotesForTag(tag: SNTag): number {
    return this.tagToNotesMap[tag.uuid]?.size || 0;
  }

  private onTagChanges(tag: SNTag): void {
    const uuids = tag.noteReferences_.map((ref) => ref.uuid);
    const countableUuids = uuids.filter((uuid) =>
      this.allCountableNotes.has(uuid)
    );
    this.tagToNotesMap[tag.uuid] = new Set(countableUuids);

    // const previousSet = this.tagToNotesMap[tag.uuid];
    // if (previousSet?.size !== countableUuids.length) {
    //   this.notifyObservers(tag.uuid);
    // }
  }

  private onNoteChange(note: SNNote): void {
    const isCountable = this.isNoteCountable(note);
    if (isCountable) {
      this.allCountableNotes.add(note.uuid);
    } else {
      this.allCountableNotes.delete(note.uuid);
    }

    // const previousAllCount = this.allCountableNotes.size;
    // if (previousAllCount !== this.allCountableNotes.size) {
    //   this.notifyObservers(undefined);
    // }

    // NOTE: this is related to the discussion on privateId
    // These sort of methods makes it looks like we where building a database that manages relationships between objects,
    // which is great. We could solve the issues of reference conflicts, orphan nodes, etc once (around the references),
    // and it'd apply to every sort of refernces (note references, parent tag references, file references, etc.).
    // 
    // This is similar to what you'd find on an old school application, multiple layers communicating through a well define API,
    //
    // [application / business domain state]
    //    ^   v
    // [business domain data]
    //    ^   v
    // [relational database]
    //
    //
    // [note taking app state management] <- this is the public API used by web (PublicSNTag, etc).
    //      ^       v
    // [note taking application data] (SNTags, SNNotes, etc).
    //      ^       v 
    // [standardnote encrypted database] (references, SNITem, mutators, etc)
    //
    //
    // This is why, to me, parent id, and others similar features should rely on one generic references system so that one feature at the db level
    // (conflict resolution, optimization, etc) is used by others.
    //
    //
    // [note taking app state management: tag.parentId] <- public API
    //      ^       v
    // [note taking application data: tag.parentId + unicity check, etc.]
    //      ^       v 
    // [standardnote encrypted database: generic item.references]
    //
    //
    // Separating database level code (indexes, references, etc) from domain level code (parentId, countableNoteCounts, etc)
    // should be a general core goal of the library for many engineering reasons we can detail.
    //
    const associatedTagUuids = this.collection.uuidsThatReferenceUuid(
      note.uuid
    );

    for (const tagUuid of associatedTagUuids) {
      const set = this.setForTag(tagUuid);
      // const previousCount = set.size;
      if (isCountable) {
        set.add(note.uuid);
      } else {
        set.delete(note.uuid);
      }
      // if (previousCount !== set.size) {
      //   this.notifyObservers(tagUuid);
      // }
    }
  }

  // This part is clearly the index / database level code (coming from the SNIndex interface).
  onChange(delta: ItemDelta): void {
    const changedOrInserted = [...delta.changed, ...delta.inserted]; // TODO: use iterator chaining instead
    const notes = changedOrInserted.filter(isNote);
    const tags = changedOrInserted.filter(isTag);

    notes.forEach(this.onNoteChange);
    tags.forEach(this.onTagChanges);
  }

  private setForTag(uuid: UuidString): Set<UuidString> {
    let set = this.tagToNotesMap[uuid];
    if (!set) {
      set = new Set();
      // Are we memory leaking on tag deletion?
      // Because we have the "shape" required to maintain an index,
      // we have the data required to fix this without changing other codes like item manager.
      this.tagToNotesMap[uuid] = set;
    }
    return set;
  }
}
