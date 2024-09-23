import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe } from '@angular/common';
import { from, map, mergeMap, toArray } from 'rxjs';
import { VideoGalleryComponent } from '../video-gallery/video-gallery.component';
import { VideoWithAnimationState } from '../shared/video';

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
  removedVideoList = signal<VideoWithAnimationState[]>([]);

  allVideos = toSignal(
    inject(VideoService)
      .getMyList()
      .pipe(
        mergeMap((videos) => from(videos)),
        map((video) => {
          return {
            ...video,
            state: 'normal',
          } as VideoWithAnimationState;
        }),
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

    return filteredVideos.reduce(
      (acc: VideoWithAnimationState[][], curr, index) => {
        if (index % 6 === 0) acc.push([]);
        acc[acc.length - 1].push(curr);
        return acc;
      },
      [],
    );
  });

  handleVideoRemoved(video: VideoWithAnimationState): void {
    this.removedVideoList.set([...this.removedVideoList(), video]);
  }

  restoreRemovedVideo(video: VideoWithAnimationState): void {
    this.removedVideoList.set(
      this.removedVideoList().filter((v) => v.id !== video.id),
    );
  }
}
