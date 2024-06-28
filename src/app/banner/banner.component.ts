import { Component, inject, input } from '@angular/core';
import { VideoService } from '../shared/video.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Video } from '../shared/video';

@Component({
  selector: 'vf-banner',
  standalone: true,
  imports: [AsyncPipe, VideoUrlPipe],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  videoService = inject(VideoService);
  id = input(4);

  video$: Observable<Video> = toObservable(this.id).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
