import { Component, inject, input } from '@angular/core';
import { VideoService } from '../shared/video.service';
import { Observable, switchMap } from 'rxjs';
import { Video } from '../shared/video';
import { toObservable } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { VjsPlayerComponent } from '../vjs-player/vjs-player.component';

@Component({
  selector: 'vf-watch',
  standalone: true,
  imports: [AsyncPipe, VjsPlayerComponent],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.scss',
})
export class WatchComponent {
  videoService = inject(VideoService);
  id = input.required<number>();

  video$: Observable<Video> = toObservable(this.id).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
