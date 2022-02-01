import { FeatureIdentifier, NoteType } from '@standardnotes/features';
import { IconType } from '@Lib/types';
import { SNComponent } from '@Models/app/component';

export class IconsController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public deinit(): void {
  }

  getIconAndTintForEditor(
    editor?: SNComponent
  ): [IconType, number] {
    switch (editor?.identifier) {
      case FeatureIdentifier.BoldEditor:
      case FeatureIdentifier.PlusEditor:
        return ['rich-text', 1];
      case FeatureIdentifier.MarkdownBasicEditor:
      case FeatureIdentifier.MarkdownMathEditor:
      case FeatureIdentifier.MarkdownMinimistEditor:
      case FeatureIdentifier.MarkdownProEditor:
        return ['markdown', 2];
      case FeatureIdentifier.TokenVaultEditor:
        return ['authenticator', 6];
      case FeatureIdentifier.SheetsEditor:
        return ['spreadsheets', 5];
      case FeatureIdentifier.TaskEditor:
        return ['tasks', 3];
      case FeatureIdentifier.CodeEditor:
        return ['code', 4];
      default:
        return this.getIconAndTintFromNoteType(editor?.package_info.note_type)
    }
  }

  private getIconAndTintFromNoteType(noteType?: NoteType): [IconType, number] {
    switch (noteType) {
      case NoteType.Authentication:
        return ['authenticator', 6];
      case NoteType.Code:
        return ['code', 4];
      case NoteType.Markdown:
        return ['markdown', 2];
      case NoteType.RichText:
        return ['rich-text', 1];
      case NoteType.Spreadsheet:
        return ['spreadsheets', 5];
      case NoteType.Task:
        return ['tasks', 3];
      default:
        return ['plain-text', 1];
    }
  }
}