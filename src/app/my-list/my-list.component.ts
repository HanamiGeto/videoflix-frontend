import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { bufferCount, from, mergeMap, toArray } from 'rxjs';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';

@Component({
  selector: 'vf-my-list',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    PreviewModalComponent,
    AsyncPipe,
    VideoGalleryComponent,
    JsonPipe,
  ],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss',
})
export class MyListComponent {
  videos = toSignal(
    inject(VideoService)
      .getMyList()
      .pipe(
        mergeMap((videos) => from(videos)),
        bufferCount(5),
        toArray(),
      ),
  );
}
