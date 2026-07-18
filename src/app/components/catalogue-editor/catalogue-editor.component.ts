import type { OnChanges, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { ImageElement, StarRating } from '../../../../interfaces/final-object.interface';
import { ImageElementService } from '../../services/image-element.service';
import { ManualTagsService } from '../tags-manual/manual-tags.service';

type CatalogueSearchField = 'all' | 'name' | 'file' | 'path' | 'tags' | 'hash';

interface StarOption {
  label: string;
  value: StarRating;
}

@Component({
  standalone: false,
  selector: 'app-catalogue-editor',
  templateUrl: './catalogue-editor.component.html',
  styleUrls: ['./catalogue-editor.component.scss']
})
export class CatalogueEditorComponent implements OnChanges {

  @Input() currentVhaFile = '';
  @Input() darkMode = false;
  @Input() images: ImageElement[] = [];
  @Input() isSaving = false;
  @Input() saveStatus = '';

  @Output() closeEditor = new EventEmitter<void>();
  @Output() entriesChanged = new EventEmitter<void>();
  @Output() saveRequested = new EventEmitter<void>();

  field: CatalogueSearchField = 'all';
  filteredEntries: ImageElement[] = [];
  query = '';
  showDeleted = false;

  readonly starOptions: StarOption[] = [
    { label: 'N/A', value: 0.5 },
    { label: '1', value: 1.5 },
    { label: '2', value: 2.5 },
    { label: '3', value: 3.5 },
    { label: '4', value: 4.5 },
    { label: '5', value: 5.5 },
  ];

  private tagDrafts: { [index: number]: string } = {};

  constructor(
    public imageElementService: ImageElementService,
    public manualTagsService: ManualTagsService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.images) {
      this.refreshFilteredEntries();
    }
  }

  get activeCount(): number {
    return this.images.filter((element: ImageElement) => !element.deleted).length;
  }

  get deletedCount(): number {
    return this.images.filter((element: ImageElement) => element.deleted).length;
  }

  get totalCount(): number {
    return this.images.length;
  }

  close(): void {
    this.commitAllTagDrafts();
    this.closeEditor.emit();
  }

  deleteEntry(item: ImageElement): void {
    this.commitTags(item);
    item.deleted = true;
    this.markDirty(true);
    this.refreshFilteredEntries();
  }

  restoreEntry(item: ImageElement): void {
    item.deleted = false;
    this.markDirty(true);
    this.refreshFilteredEntries();
  }

  refreshFilteredEntries(): void {
    const needle = this.query.trim().toLowerCase();

    this.filteredEntries = this.images.filter((item: ImageElement) => {
      if (!this.showDeleted && item.deleted) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return this.getSearchText(item).includes(needle);
    });
  }

  requestSave(): void {
    this.commitAllTagDrafts();
    this.saveRequested.emit();
  }

  tagDraftFor(item: ImageElement): string {
    if (this.tagDrafts[item.index] === undefined) {
      this.tagDrafts[item.index] = this.tagsToString(item);
    }

    return this.tagDrafts[item.index];
  }

  trackByImageIndex(index: number, item: ImageElement): number {
    return item.index === undefined ? index : item.index;
  }

  updateDefaultScreen(item: ImageElement, value: string | number): void {
    const parsed = this.toOptionalInteger(value);

    if (parsed === undefined) {
      if (item.defaultScreen !== undefined) {
        delete item.defaultScreen;
        this.markDirty();
      }
      return;
    }

    if (item.defaultScreen !== parsed) {
      item.defaultScreen = parsed;
      this.markDirty();
    }
  }

  updateNotes(item: ImageElement, value: string): void {
    if (value) {
      if (item.notes !== value) {
        item.notes = value;
        this.markDirty();
      }
    } else if (item.notes !== undefined) {
      delete item.notes;
      this.markDirty();
    }
  }

  updateNumberField(item: ImageElement, field: 'timesPlayed', value: string | number): void {
    const parsed = Math.max(0, this.toOptionalInteger(value) || 0);

    if (item[field] !== parsed) {
      item[field] = parsed;
      this.markDirty();
    }
  }

  updateStar(item: ImageElement, value: StarRating): void {
    if (item.stars !== value) {
      item.stars = value;
      this.imageElementService.forceStarFilterUpdate = !this.imageElementService.forceStarFilterUpdate;
      this.markDirty();
    }
  }

  updateStringField(item: ImageElement, field: 'cleanName' | 'fileName' | 'partialPath', value: string): void {
    const nextValue = value || '';

    if (item[field] !== nextValue) {
      item[field] = nextValue;
      this.markDirty();
      this.refreshFilteredEntries();
    }
  }

  updateTagDraft(item: ImageElement, value: string): void {
    this.tagDrafts[item.index] = value;
  }

  updateYear(item: ImageElement, value: string | number): void {
    const parsed = this.toOptionalInteger(value);

    if (parsed === undefined) {
      if (item.year !== undefined) {
        delete item.year;
        this.markDirty();
      }
      return;
    }

    if (item.year !== parsed) {
      item.year = parsed;
      this.markDirty();
    }
  }

  private commitAllTagDrafts(): void {
    Object.keys(this.tagDrafts).forEach((indexString: string) => {
      const itemIndex = parseInt(indexString, 10);
      const item = this.images.find((element: ImageElement) => element.index === itemIndex);

      if (item) {
        this.commitTags(item);
      }
    });
  }

  commitTags(item: ImageElement): void {
    const currentTags = item.tags || [];
    const nextTags = this.parseTags(this.tagDrafts[item.index] || '');

    if (this.tagsMatch(currentTags, nextTags)) {
      return;
    }

    if (nextTags.length) {
      item.tags = nextTags;
    } else {
      delete item.tags;
    }

    this.tagDrafts[item.index] = this.tagsToString(item);
    this.markDirty(true);
    this.refreshFilteredEntries();
  }

  private getSearchText(item: ImageElement): string {
    const tags = (item.tags || []).join(' ');

    if (this.field === 'name') {
      return (item.cleanName || '').toLowerCase();
    } else if (this.field === 'file') {
      return (item.fileName || '').toLowerCase();
    } else if (this.field === 'path') {
      return (item.partialPath || '').toLowerCase();
    } else if (this.field === 'tags') {
      return tags.toLowerCase();
    } else if (this.field === 'hash') {
      return (item.hash || '').toLowerCase();
    }

    return [
      item.cleanName,
      item.fileName,
      item.partialPath,
      tags,
      item.hash,
      item.inputSource,
      item.notes,
      item.year,
    ].join(' ').toLowerCase();
  }

  private markDirty(rebuildTags = false): void {
    this.imageElementService.finalArrayNeedsSaving = true;

    if (rebuildTags) {
      this.manualTagsService.removeAllTags();
      this.manualTagsService.populateManualTagsService(
        this.images.filter((element: ImageElement) => !element.deleted)
      );
    }

    this.entriesChanged.emit();
  }

  private parseTags(tagText: string): string[] {
    const seen = new Set<string>();

    return tagText
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => {
        const key = tag.toLowerCase();

        if (!tag || seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });
  }

  private tagsMatch(left: string[], right: string[]): boolean {
    if (left.length !== right.length) {
      return false;
    }

    return left.every((tag: string, index: number) => tag === right[index]);
  }

  private tagsToString(item: ImageElement): string {
    return (item.tags || []).join(', ');
  }

  private toOptionalInteger(value: string | number): number | undefined {
    if (value === '' || value === null || value === undefined) {
      return undefined;
    }

    const parsed = Math.floor(Number(value));

    return Number.isFinite(parsed) ? parsed : undefined;
  }

}
