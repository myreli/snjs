import { ContentType } from '@Lib/index';
import { SNTag } from '@Models/app/tag';
import { SNPredicate } from '@Models/core/predicate';
import { PurePayload } from './../../protocol/payloads/pure_payload';

export const SMART_TAG_DSL_PREFIX = '![';

type SmartTagPredicateOperator =
  | 'and'
  | 'or'
  | 'not'
  | '!='
  | '='
  | '<'
  | '>'
  | '>='
  | '<='
  | 'startsWith'
  | 'in'
  | 'includes'
  | 'matches';

export interface SmartTagPredicateContent {
  keypath: string;
  operator: SmartTagPredicateOperator;
  value: string | Date | boolean | number | boolean | SmartTagPredicateContent;
}

/**
 * A tag that defines a predicate that consumers can use to retrieve a dynamic
 * list of notes.
 */
export class SNSmartTag extends SNTag {
  public readonly predicate!: SNPredicate;

  constructor(payload: PurePayload) {
    super(payload);

    // Note: I believe this should never happen,
    // but I just want to be 100% sure this case never happens:
    // The software architecture is designed around the idea that an instance of Tag might actually be a SmartTag.
    if (payload.content_type !== ContentType.SmartTag) {
      throw new Error('invalid input');
    }
    if (payload.safeContent.predicate) {
      this.predicate = SNPredicate.FromJson(payload.safeContent.predicate);
    }
  }

  public get isSmartTag(): boolean {
    return true;
  }

  public get isSystemSmartTag(): boolean {
    return this.payload.safeContent.isSystemTag;
  }

  public get isAllTag(): boolean {
    return this.payload.safeContent.isAllTag;
  }

  public get isTrashTag(): boolean {
    return this.payload.safeContent.isTrashTag;
  }

  public get isArchiveTag(): boolean {
    return this.payload.safeContent.isArchiveTag;
  }
}
