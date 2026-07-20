import { Component, input, output, effect } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ImageElementService } from './../../services/image-element.service';
import { ModalService } from '../modal/modal.service';
import { ManualTagsService } from '../tags-manual/manual-tags.service';

import { modalAnimation } from '../../common/animations';

import type { AppStateInterface } from '../../common/app-state';
import type { TagEmit } from '../../../../interfaces/shared-interfaces';

@Component({
  standalone: false,
  selector: 'app-tag-tray',
  templateUrl: './tag-tray.component.html',
  styleUrls: [
    '../layout.scss',
    '../settings.scss',
    '../search-input.scss',
    '../wizard-button.scss',
    './tag-tray.component.scss'
  ],
  animations: [modalAnimation]
})
export class TagTrayComponent {

  readonly toggleBatchTaggingMode = output<void>();
  readonly handleTagWordClicked = output<TagEmit>();
  readonly selectAll = output<void>();
  readonly selectNone = output<void>();
  readonly tagRemovedGlobally = output<void>();

  readonly appState = input<AppStateInterface>();
  readonly batchTaggingMode = input();
  readonly darkMode = input<boolean>();
  readonly updateTotalSelectedTrigger = input<number>(0);

  manualTagFilterString = '';
  manualTagShowFrequency = true;
  recomputeTrigger = 0;

  removeThisTag(tag: string): void {
    const affectedVideoCount = this.imageElementService.imageElements
      .filter((element) => element.tags?.includes(tag))
      .length;
    const messageKey = affectedVideoCount === 1
      ? 'TAGS.confirmRemoveTagMessageSingle'
      : 'TAGS.confirmRemoveTagMessage';

    this.modalService.openConfirmationDialog(
      this.translate.instant('TAGS.confirmRemoveTagTitle'),
      this.translate.instant(messageKey, {
        count: affectedVideoCount,
        tagName: tag,
      }),
      this.translate.instant('TAGS.removeFromCatalogue'),
      this.translate.instant('SYSTEM.cancel'),
    ).subscribe((confirmed: boolean) => {
      if (!confirmed) {
        return;
      }

      this.imageElementService.removeTagFromAll(tag);
      this.manualTagsService.removeTagGlobally(tag);
      this.tagRemovedGlobally.emit();
    });
  }

  constructor(
    public manualTagsService: ManualTagsService,
    public imageElementService: ImageElementService,
    private modalService: ModalService,
    private translate: TranslateService,
  ) {
    effect(() => {
      this.recomputeTrigger = this.updateTotalSelectedTrigger();
    })
  }

  selectAllPressed(): void {
    this.recomputeTrigger = Date.now();
    this.selectAll.emit();
  }

  deselectAllPressed(): void {
    this.recomputeTrigger = Date.now();
    this.selectNone.emit();
  }

  /**
   * Handle tag right-click event - show color picker via service
   * @param event - Object containing tag and mouse event
   */
  onTagRightClick(event: { tag: any, event: PointerEvent }): void {
    // Emit event to show color picker at home component level
    this.manualTagsService.showColorPickerSubject.next({
      tagName: event.tag.name,
      currentColor: event.tag.colour || '',
      position: {
        x: event.event.clientX,
        y: event.event.clientY
      }
    });
  }

}
