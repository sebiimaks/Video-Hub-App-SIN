import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  standalone: false,
  name: 'folderArrowsPipe'
})
export class FolderArrowsPipe implements PipeTransform {

  /**
   * Return HTML string with `>` arrow instead of the `/` path dividier
   * @param folderPath
   */
  transform(folderPath: string, markFinalSegment = false): string {

    const arrowString = '<span class="icon icon-arrow"></span>';

    const htmlString = folderPath.replace(/\/|\\/g, arrowString);

    if (markFinalSegment) {
      const lastForwardSlash = folderPath.lastIndexOf('/');
      const lastBackslash = folderPath.lastIndexOf('\\');
      const lastDivider = Math.max(lastForwardSlash, lastBackslash);
      const finalSegment = folderPath.substring(lastDivider + 1);

      if (finalSegment) {
        const parentPath = folderPath.substring(0, lastDivider + 1).replace(/\/|\\/g, arrowString);
        return `${parentPath}<span class="folder-path-final-segment">${finalSegment}</span>`;
      }
    }

    return `${htmlString}`;

  }

}
