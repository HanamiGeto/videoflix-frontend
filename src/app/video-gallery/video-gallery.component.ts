import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  Signal,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { VideoService } from '../shared/video.service';
import { map, Observable, switchMap } from 'rxjs';
import { Video, VideoWithAnimationState } from '../shared/video';
import { toObservable } from '@angular/core/rxjs-interop';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe } from '@angular/common';
import Swiper from 'swiper/bundle';
import { ToastService } from '../shared/toast.service';
import { videoListAnimation } from '../shared/animations';

@Component({
  selector: 'vf-video-gallery',
  standalone: true,
  imports: [PreviewModalComponent, AsyncPipe],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
  animations: [videoListAnimation],
})
export class VideoGalleryComponent {
  private readonly swiper = viewChild<ElementRef>('swiper');
  private readonly videoCards = viewChildren<ElementRef>('video');
  private debounceTimeout?: ReturnType<typeof setTimeout>;
  showPreviewOnHover = signal<boolean>(false);
  hoveredVideoId = signal(0);
  isPreviewVisible = false;
  currentStylesContainer: Record<string, string> = {};
  currentStylesContent: Record<string, string> = {};
  private readonly videoService = inject(VideoService);
  private toastService = inject(ToastService);
  videoGenre = input<string>();
  enableSwiper = input.required<boolean>();
  videoSource = input.required<
    Video[] | VideoWithAnimationState[] | undefined | null
  >();
  videoRemoved = output<VideoWithAnimationState>();
  videoRestored = output<VideoWithAnimationState>();
  private undoRemovedVideo = signal(false);
  startXOffset = 0;
  startYOffset = 0;
  startScaleX = 0;
  startScaleY = 0;
  disablePreviewModalAnimation = signal(false);

  video$: Observable<VideoWithAnimationState> = toObservable(
    this.hoveredVideoId,
  ).pipe(
    switchMap((id) =>
      this.videoService.getSingle(id).pipe(
        map((video) => {
          return {
            ...video,
            state: 'normal',
          } as VideoWithAnimationState;
        }),
      ),
    ),
  );

  videos: Signal<VideoWithAnimationState[] | Video[]> = computed(() => {
    const videos = this.videoSource();
    if (!videos || videos.length === 0) {
      return [];
    }
    return videos.filter((video) =>
      this.videoGenre() ? video.genre_display === this.videoGenre() : true,
    );
  });

  constructor() {
    effect(() => {
      if (this.videos() && this.videos().length > 0) {
        this.initializeSwiper();
      }
    });
  }

  initializeSwiper(): void {
    if (this.swiper()) {
      new Swiper(this.swiper()!.nativeElement, {
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: this.enableSwiper() ? true : false,
        spaceBetween: 6,
        enabled: this.enableSwiper(),
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
        },
      });
    }
  }

  removeVideo(video: VideoWithAnimationState): void {
    const videoIndex = this.findVideoIndex(video);

    if (videoIndex !== -1) {
      this.showUndoToast(video);
      setTimeout(() => {
        if (!this.undoRemovedVideo()) {
          this.finalizeVideoRemoval(video);
        }
      }, 5000);
    }
    this.disablePreviewModalAnimation.set(true);
    this.videoRemoved.emit(video);
    this.undoRemovedVideo.set(false);
  }

  findVideoIndex(video: Video): number {
    return this.videos().findIndex((vid) => vid.id === video.id);
  }

  showUndoToast(video: VideoWithAnimationState) {
    this.toastService.showToast({
      text: `<strong>${video.title}</strong> was removed from your List.`,
      undoCallback: () => this.restoreRemovedVideo(video),
    });
  }

  finalizeVideoRemoval(video: VideoWithAnimationState): void {
    this.videoRemoved.emit(video);
    this.commitVideoRemoval(video);
  }

  commitVideoRemoval(video: Video): void {
    this.videoService.updateMyList(video).subscribe();
  }

  restoreRemovedVideo(video: VideoWithAnimationState): void {
    this.videoRestored.emit(video);
    this.undoRemovedVideo.set(true);
    this.disablePreviewModalAnimation.set(false);
  }

  displayPreviewModal(videoId: number, index: number): void {
    this.debounceTimeout = setTimeout(() => {
      this.hoveredVideoId.set(videoId);
      this.fetchHoveredVideoRect(videoId, index);
      this.showPreviewOnHover.set(true);
    }, 500);
  }

  clearTime() {
    clearTimeout(this.debounceTimeout);
  }

  fetchHoveredVideoRect(videoId: number, index: number): void {
    const hoveredVideo = this.videoCards().find(
      (video) => video.nativeElement.id === videoId.toString(),
    );
    if (hoveredVideo) {
      const boundingRect = hoveredVideo.nativeElement.getBoundingClientRect();
      this.configureAnimationParams(index, boundingRect);
      this.updateContentStyles(boundingRect.height);
    }
  }

  updateContainerStyles(cardWidth: number, cardX: number) {
    this.currentStylesContainer = {
      width: `${cardWidth * 1.5}px`,
      left: `${cardX}px`,
    };
  }

  updateContentStyles(cardHeight: number) {
    this.currentStylesContent = {
      height: `${cardHeight * 1.5}px`,
    };
  }

  configureAnimationParams(index: number, card: DOMRect): void {
    const relativeIndex = index % 6;
    const modalWidth = card.width * 1.5;
    const modalContentHeight = card.height * 1.5;
    const scaleX = card.width / modalWidth;
    const scaleY = card.height / modalContentHeight;
    const offsetX = (card.width - modalWidth) / 2;
    const offsetY = (card.height * (1 - scaleY)) / 2;

    switch (relativeIndex) {
      case 0:
        // Ganz linke Karte
        this.startXOffset = offsetX;
        this.startYOffset = offsetY;
        this.updateContainerStyles(card.width, card.x);
        break;
      case 5:
        // Ganz rechte Karte
        this.startXOffset = -offsetX;
        this.startYOffset = offsetY;
        this.updateContainerStyles(
          card.width,
          card.x - (modalWidth - card.width),
        );
        break;
      default:
        // Karten dazwischen
        this.startXOffset = 0;
        this.startYOffset = offsetY;
        this.updateContainerStyles(
          card.width,
          card.x - (modalWidth - card.width) / 2,
        );
        break;
    }
    this.startScaleX = scaleX;
    this.startScaleY = scaleY;
  }

  videoHasState(
    video: Video | VideoWithAnimationState,
  ): video is VideoWithAnimationState {
    return (video as VideoWithAnimationState).state !== undefined;
  }
}
