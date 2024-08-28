import { Component, inject } from '@angular/core';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { map } from 'rxjs';
import { AsyncPipe, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [
    PreviewModalComponent,
    VideoUrlPipe,
    AsyncPipe,
    RouterLink,
    NgStyle,
    VideoGalleryComponent,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  videoGenres = toSignal(
    inject(VideoService)
      .getAll()
      .pipe(
        map((videos) => {
          const genres = Array.from(
            new Set(videos.map((video) => video.genre_display)),
          );
          return genres;
        }),
      ),
  );

  videos = toSignal(inject(VideoService).getAll());
}
