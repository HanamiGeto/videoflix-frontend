import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe } from '@angular/common';
import { bufferCount, from, mergeMap, toArray } from 'rxjs';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';
import { Video } from '../shared/video';

@Component({
  selector: 'vf-my-list',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    PreviewModalComponent,
    AsyncPipe,
    VideoGalleryComponent,
  ],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss',
})
export class MyListComponent {
  removedVideoList = signal<Video[]>([]);
  videos = toSignal(
    inject(VideoService)
      .getMyList()
      .pipe(
        mergeMap((videos) => from(videos)),
        bufferCount(6),
        toArray(),
      ),
  );

  handleVideoRemoved(video: Video): void {
    this.removedVideoList.set([...this.removedVideoList(), video]);
  }

  restoreRemovedVideo(video: Video): void {
    this.removedVideoList.set(
      this.removedVideoList().filter((v) => v.id !== video.id),
    );
  }
}
