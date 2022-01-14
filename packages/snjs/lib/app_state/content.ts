import { ContentType, SNItem, SNNote, SNSmartTag, SNTag } from '@Lib/models';

interface ITag {
    contentType: ContentType;
    title: string;
    count: number;
}

const ContentItemMapper = {
  [ContentType.Tag]: SNTag,
  [ContentType.SmartTag]: SNSmartTag,
  [ContentType.Note]: SNNote,
};

type ContentIdentifier = keyof typeof ContentItemMapper;

type OutputOf<T extends ContentIdentifier> = typeof ContentItemMapper[T];

// type Z1 = OutputOf<ContentType.Tag> // typeof SNTag
// type Z2 = OutputOf<ContentType.Tag | ContentType.SmartTag> // typeof Tag | typeof SmartTag
// type Z3 = OutputOf<ContentType.Tag | ContentType.SmartTag | ContentType.Note> // typeof * 3

type ContentInstanceMapped<T extends ContentIdentifier> = InstanceType<
  OutputOf<T>
>;

// const sub = <T extends ContentIdentifier>(x: T[], callback: (item: InstanceType<OutputOf<T>>) => void) => {
//     console.log(x);
// }

// type LLL = InstanceType<Z3>

// sub([ContentType.Note], (item) => {
//     console.log(item)
// })

type Unsubscribe = () => void;

export interface IAppState {
  streamItems<T extends ContentIdentifier>(
    contentIdentifier: T | T[],
    callback: (items: ContentInstanceMapped<T>[]) => void
  ): Unsubscribe;
}

class AppState implements IAppState {
  streamItems<T extends ContentIdentifier>(
    contentIdentifier: T | T[],
    callback: (items: InstanceType<OutputOf<T>>[]) => void
  ): Unsubscribe {
    throw new Error('Method not implemented.');
  }
}

// a.onContentChange(
//     [ContentType.Note, ContentType.Tag],
//     (items: (SNItem)[]) => {
//       console.log('items:', items);
//     }
//   );

//   a.onContentChange(
//     [ContentType.Note, ContentType.Tag],
//     (items: (SNItem)[]) => {
//       console.log('items:', items);
//     }
//   );

//   a.onContentChange(
//     [ContentType.Note, ContentType.Tag],
//     (items: (SNItem)[]) => {
//       console.log('items:', items);
//     }
//   );
