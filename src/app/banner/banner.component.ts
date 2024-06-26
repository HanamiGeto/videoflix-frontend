import { Component, inject, input } from '@angular/core';
import { VideoService } from '../shared/video.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { VideoUrlPipe } from '../shared/video-url.pipe';

@Component({
  selector: 'vf-banner',
  standalone: true,
  imports: [AsyncPipe, VideoUrlPipe],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  videoService = inject(VideoService);
  id = input(24);

  video$ = toObservable(this.id).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
