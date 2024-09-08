import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe } from '@angular/common';
import { from, mergeMap, toArray } from 'rxjs';
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
  allVideos = toSignal(
    inject(VideoService)
      .getMyList()
      .pipe(
        mergeMap((videos) => from(videos)),
        toArray(),
      ),
  );

  videos = computed(() => {
    const allVideos = this.allVideos();
    const removedVideos = this.removedVideoList();

    if (!allVideos || allVideos.length === 0) {
      return [];
    }

    const filteredVideos = allVideos.filter(
      (video) =>
        !removedVideos.some((removedVideo) => removedVideo.id === video.id),
    );

    return filteredVideos.reduce((acc: Video[][], curr, index) => {
      if (index % 6 === 0) acc.push([]);
      acc[acc.length - 1].push(curr);
      return acc;
    }, []);
  });

  handleVideoRemoved(video: Video): void {
    this.removedVideoList.set([...this.removedVideoList(), video]);
  }

  restoreRemovedVideo(video: Video): void {
    this.removedVideoList.set(
      this.removedVideoList().filter((v) => v.id !== video.id),
    );
  }
}
