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
  updatedVideoList = signal<VideoWithAnimationState[]>([]);
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
    const updatedVideos = this.updatedVideoList();
    const removedVideos = this.removedVideoList();

    if (!allVideos || allVideos.length === 0) return [];

    const displayVideos = updatedVideos.length > 0 ? updatedVideos : allVideos;

    const filteredVideos = displayVideos.filter(
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
    const allVideos = this.allVideos();
    const removedIndex = allVideos!.findIndex((vid) => vid.id === video.id);

    if (removedIndex === -1) return;

    const videosPerRow = 6;
    const rowStartIndex =
      Math.floor(removedIndex / videosPerRow) * videosPerRow;
    const rowEndIndex = rowStartIndex + videosPerRow - 1;

    const updatedVideos: VideoWithAnimationState[] = allVideos!.map(
      (vid, idx) => {
        if (vid.id === video.id) {
          return {
            ...vid,
            state: 'removed',
          };
        }
        if (idx > removedIndex && idx <= rowEndIndex) {
          return {
            ...vid,
            state: 'shift',
          };
        }
        if (idx > rowEndIndex) {
          return {
            ...vid,
            state: 'nextRowRemoved',
          };
        }
        return vid;
      },
    );
    this.updatedVideoList.set(updatedVideos);
    this.removedVideoList.set([
      ...this.removedVideoList(),
      video,
      ...this.updatedVideoList().filter(
        (vid) => vid.state === 'nextRowRemoved',
      ),
    ]);
    setTimeout(() => {
      this.removedVideoList.set([video]);
    }, 500);
  }

  restoreRemovedVideo(video: VideoWithAnimationState): void {
    const removedIndex = this.allVideos()!.findIndex(
      (vid) => vid.id === video.id,
    );
    if (removedIndex === -1) return;
    const updatedVideos: VideoWithAnimationState[] =
      this.updatedVideoList().map((vid) => {
        if (vid.state === 'shift') {
          return { ...vid, state: 'normal' };
        }
        return vid;
      });

    this.updatedVideoList.set(updatedVideos);
    this.removedVideoList.set([
      ...this.removedVideoList(),
      ...this.updatedVideoList().filter(
        (vid) => vid.state === 'nextRowRemoved',
      ),
    ]);

    setTimeout(() => {
      this.removedVideoList.set([]);
    }, 500);
  }
}
