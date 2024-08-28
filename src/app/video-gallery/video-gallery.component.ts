import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Signal,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { VideoService } from '../shared/video.service';
import { Observable, switchMap } from 'rxjs';
import { Video } from '../shared/video';
import { toObservable } from '@angular/core/rxjs-interop';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { AsyncPipe } from '@angular/common';
import Swiper from 'swiper/bundle';

@Component({
  selector: 'vf-video-gallery',
  standalone: true,
  imports: [PreviewModalComponent, AsyncPipe],
  templateUrl: './video-gallery.component.html',
  styleUrl: './video-gallery.component.scss',
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
  videoGenre = input<string>();
  enableSwiper = input.required<boolean>();
  videoSource = input.required<Video[] | undefined>();
  startXOffset = 0;
  startYOffset = 0;
  startScaleX = 0;
  startScaleY = 0;

  video$: Observable<Video> = toObservable(this.hoveredVideoId).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );

  videos: Signal<Video[]> = computed(() => {
    const videos = this.videoSource();
    return videos!.filter((video) =>
      this.videoGenre() ? video.genre_display === this.videoGenre() : true,
    );
  });

  constructor() {
    effect(() => {
      if (this.videos()) {
        this.initializeSwiper();
      }
    });
  }

  initializeSwiper(): void {
    if (this.swiper()) {
      new Swiper(this.swiper()!.nativeElement, {
        slidesPerView: this.enableSwiper() ? 6 : 5,
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
}