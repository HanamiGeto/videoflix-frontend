import { AnimationEvent } from '@angular/animations';
import {
  Component,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import Swiper from 'swiper/bundle';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Observable, switchMap } from 'rxjs';
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
  showPreviewVideoAfterAnimation = false;
  xPositionOfHoveredVideo = 0;
  videos = toSignal(inject(VideoService).getAll());
  private readonly videoService = inject(VideoService);

  video$: Observable<Video> = toObservable(this.hoveredVideoId).pipe(
    switchMap((id) => this.videoService.getSingle(id)),
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

  showPreviewModal(videoId: number): void {
    this.debounceTimeout = setTimeout(() => {
      this.hoveredVideoId.set(videoId);
      this.getPositionOfHoveredVideo(videoId);
      this.showPreviewOnHover.set(true);
    }, 500);
  }

  clearTime() {
    clearTimeout(this.debounceTimeout);
  }

  getPositionOfHoveredVideo(videoId: number): void {
    const hoveredVideo = this.videoCards().find(
      (video) => video.nativeElement.id === videoId.toString(),
    );
    if (hoveredVideo) {
      console.log(this.videoCards().length);
      console.log(hoveredVideo.nativeElement.ariaLabel.slice(0, 1));
      console.log(hoveredVideo.nativeElement.ariaLabel.slice(0, 1));
      const boundingRect = hoveredVideo.nativeElement.getBoundingClientRect();
      console.log(boundingRect);
      this.xPositionOfHoveredVideo = boundingRect.x;
    }
  }

  onAnimationEvent(event: AnimationEvent): void {
    if (event.phaseName === 'done') {
      this.showPreviewVideoAfterAnimation =
        !this.showPreviewVideoAfterAnimation;
    }
  }
}
