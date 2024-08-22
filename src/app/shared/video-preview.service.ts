import {
  ElementRef,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { VideoService } from './video.service';
import { Observable, switchMap } from 'rxjs';
import { Video } from './video';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class VideoPreviewService {
  currentStylesContainer = signal<Record<string, string>>({});
  currentStylesContent = signal<Record<string, string>>({});
  hoveredVideoId = signal(0);
  startXOffset = signal(0);
  startYOffset = signal(0);
  startScaleX = signal(0);
  startScaleY = signal(0);
  private debounceTimeout?: ReturnType<typeof setTimeout>;
  private videoService = inject(VideoService);

  video$: Observable<Video> = toObservable(this.hoveredVideoId).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
  );

  displayPreviewModal(
    videoId: number,
    index: number,
    videoCards: readonly ElementRef[],
    showPreviewOnHover: WritableSignal<boolean>,
    moduloBase: number,
  ): void {
    this.debounceTimeout = setTimeout(() => {
      this.hoveredVideoId.set(videoId);
      this.fetchHoveredVideoRect(videoId, index, videoCards, moduloBase);
      showPreviewOnHover.set(true);
    }, 500);
  }

  clearTime() {
    clearTimeout(this.debounceTimeout);
  }

  private fetchHoveredVideoRect(
    videoId: number,
    index: number,
    videoCards: readonly ElementRef[],
    moduloBase: number,
  ): void {
    const hoveredVideo = videoCards.find(
      (video) => video.nativeElement.id === videoId.toString(),
    );
    if (hoveredVideo) {
      const boundingRect = hoveredVideo.nativeElement.getBoundingClientRect();
      this.configureAnimationParams(index, boundingRect, moduloBase);
      this.updateContentStyles(boundingRect.height);
    }
  }

  private updateContainerStyles(cardWidth: number, cardX: number) {
    this.currentStylesContainer.set({
      width: `${cardWidth * 1.5}px`,
      left: `${cardX}px`,
    });
  }

  private updateContentStyles(cardHeight: number) {
    this.currentStylesContent.set({
      height: `${cardHeight * 1.5}px`,
    });
  }

  private configureAnimationParams(
    index: number,
    card: DOMRect,
    moduloBase: number,
  ): void {
    const relativeIndex = index % moduloBase;
    const modalWidth = card.width * 1.5;
    const modalContentHeight = card.height * 1.5;
    const scaleX = card.width / modalWidth;
    const scaleY = card.height / modalContentHeight;
    const offsetX = (card.width - modalWidth) / 2;
    const offsetY = (card.height * (1 - scaleY)) / 2;

    switch (relativeIndex) {
      case 0:
        // Ganz linke Karte
        this.startXOffset.set(offsetX);
        this.startYOffset.set(offsetY);
        this.updateContainerStyles(card.width, card.x);
        break;
      case moduloBase - 1:
        // Ganz rechte Karte
        this.startXOffset.set(-offsetX);
        this.startYOffset.set(offsetY);
        this.updateContainerStyles(
          card.width,
          card.x - (modalWidth - card.width),
        );
        break;
      default:
        // Karten dazwischen
        this.startXOffset.set(0);
        this.startYOffset.set(offsetY);
        this.updateContainerStyles(
          card.width,
          card.x - (modalWidth - card.width) / 2,
        );
        break;
    }
    this.startScaleX.set(scaleX);
    this.startScaleY.set(scaleY);
  }
}
