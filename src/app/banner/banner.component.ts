import { Component, inject, input } from '@angular/core';
import { VideoService } from '../shared/video.service';
import { environment } from '../../environments/environment';
import { AsyncPipe } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'vf-banner',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  videoService = inject(VideoService);
  id = input(24);
  apiUrl = environment.apiUrl.slice(0, -1);

  video$ = toObservable(this.id).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );
}
