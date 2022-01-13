import { ContentReference } from '@Lib/protocol/payloads/generator';
import { ContentType } from '@Models/content_types';
import { ItemMutator, SNItem } from '@Models/core/item';
import { PurePayload } from '@Protocol/payloads/pure_payload';
import { UuidString } from './../../types';
import { ItemContent } from './../core/item';

export interface TagContent extends ItemContent {
  title: string;
}

export const isTag = (x: SNItem): x is SNTag =>
  x.content_type === ContentType.Tag;

/**
 * Allows organization of notes into groups.
 * A tag can have many notes, and a note can have many tags.
 */
export class SNTag extends SNItem implements TagContent {
  public readonly title: string;

  constructor(payload: PurePayload) {
    super(payload);
    this.title = this.payload.safeContent.title || '';
  }

  // Remove this because it's generally broken.
  // I am "unhappy" about this because I believe that makes for a more comprehensive API
  // (subscribe to object and read their fields, push global comments, see CQRS).
  // For example, counts are application.getCount level operation, but title is local.
  // What about parents, and others?
  //
  // The direction we're pushing right now is more "every piece of data needs a global field"
  //
  // Adding back as a private API
  get noteReferences_(): ContentReference[] {
    const references = this.payload.safeReferences;
    return references.filter((ref) => ref.content_type === ContentType.Note);
  }

  // get noteCount(): number {
  //   return this.noteReferences.length;
  // }

  public get isSmartTag(): boolean {
    return false;
  }

  public get isSystemSmartTag(): boolean {
    return false;
  }

  public get isAllTag(): boolean {
    return false;
  }

  public get isTrashTag(): boolean {
    return false;
  }

  public get isArchiveTag(): boolean {
    return false;
  }

  public get parentId(): UuidString | undefined {
    const reference = this.references.find(
      (ref) => ref.content_type === ContentType.Tag
    );
    return reference?.uuid;
  }

  public static arrayToDisplayString(tags: SNTag[]): string {
    return tags
      .sort((a, b) => {
        return a.title > b.title ? 1 : -1;
      })
      .map((tag) => {
        return '#' + tag.title;
      })
      .join(' ');
  }
}

export class TagMutator extends ItemMutator {
  get typedContent(): TagContent {
    return this.content as TagContent;
  }

  set title(title: string) {
    this.typedContent.title = title;
  }

  public makeChildOf(tag: SNTag): void {
    const references = this.item.references.filter(
      (ref) => ref.content_type !== ContentType.Tag
    );
    references.push({
      content_type: ContentType.Tag,
      uuid: tag.uuid,
    });
    this.typedContent.references = references;
  }
}
