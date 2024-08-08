import { AnimationEvent } from '@angular/animations';
import {
  Component,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import Swiper from 'swiper/bundle';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Observable, of, switchMap } from 'rxjs';
import { Video } from '../shared/video';
import { AsyncPipe, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { previewModalAnimation } from '../shared/animations';

@Component({
  selector: 'vf-carousel',
  standalone: true,
  imports: [
    PreviewModalComponent,
    VideoUrlPipe,
    AsyncPipe,
    RouterLink,
    NgStyle,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  animations: [previewModalAnimation],
})
export class CarouselComponent {
  private readonly swiper = viewChild<ElementRef>('swiper');
  private readonly videoCards = viewChildren<ElementRef>('video');
  private debounceTimeout?: ReturnType<typeof setTimeout>;
  showPreviewOnHover = signal<boolean>(false);
  hoveredVideoId = signal(0);
  isPreviewVisible = false;
  currentStylesContainer: Record<string, string> = {};
  currentStylesContent: Record<string, string> = {};
  private readonly videoService = inject(VideoService);
  videoGenre = input.required<string>();
  startXOffset = 0;
  startYOffset = 0;
  startScaleX = 0;
  startScaleY = 0;

  video$: Observable<Video> = toObservable(this.hoveredVideoId).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );

  videos = toSignal(
    inject(VideoService)
      .getAll()
      .pipe(
        switchMap((videos) =>
          of(
            videos.filter((video) => video.genre_display === this.videoGenre()),
          ),
        ),
      ),
  );

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
        slidesPerView: 6,
        slidesPerGroup: 6,
        loop: true,
        spaceBetween: 6,
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

  onAnimationEvent(event: AnimationEvent): void {
    if (event.phaseName === 'done') {
      this.isPreviewVisible = !this.isPreviewVisible;
    }
  }
}
