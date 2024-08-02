import { Component, inject, input } from '@angular/core';
import { VideoService } from '../shared/video.service';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Video } from '../shared/video';
import { RouterLink } from '@angular/router';
import { VjsPlayerComponent } from '../vjs-player/vjs-player.component';

@Component({
  selector: 'vf-banner',
  standalone: true,
  imports: [AsyncPipe, VideoUrlPipe, RouterLink, VjsPlayerComponent],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  videoService = inject(VideoService);
  id = input(6);

  video$: Observable<Video> = toObservable(this.id).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
