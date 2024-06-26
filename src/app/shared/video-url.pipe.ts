import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
  name: 'videoUrl',
  standalone: true,
})
export class VideoUrlPipe implements PipeTransform {
  transform(videoFile: string): string {
    return `${environment.apiUrl.slice(0, -1)}${videoFile}`;
  }
}
