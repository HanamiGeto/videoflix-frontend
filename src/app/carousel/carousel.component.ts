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
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { VideoUrlPipe } from '../shared/video-url.pipe';
import { Observable, of, switchMap } from 'rxjs';
import { Video } from '../shared/video';
import { AsyncPipe, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoPreviewService } from '../shared/video-preview.service';

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
})
export class CarouselComponent {
  private readonly swiper = viewChild<ElementRef>('swiper');
  private videoCards = viewChildren<ElementRef>('video');
  showPreviewOnHover = signal<boolean>(false);
  videoGenre = input.required<string>();
  private readonly videoPreviewService = inject(VideoPreviewService);
  private moduloBase = 6;

  video$: Observable<Video> = this.videoPreviewService.video$;

  videos = toSignal(
    inject(VideoService)
      .getAll()
      .pipe(
        switchMap((videos) =>
          of(
            videos
              .filter((video) => video.genre_display === this.videoGenre())
              .sort((a, b) => a.id - b.id),
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
    this.videoPreviewService.displayPreviewModal(
      videoId,
      index,
      this.videoCards(),
      this.showPreviewOnHover,
      this.moduloBase,
    );
  }

  clearTime() {
    this.videoPreviewService.clearTime();
  }

  get currentStylesContainer() {
    return this.videoPreviewService.currentStylesContainer();
  }

  get currentStylesContent() {
    return this.videoPreviewService.currentStylesContent();
  }

  get startXOffset() {
    return this.videoPreviewService.startXOffset();
  }

  get startYOffset() {
    return this.videoPreviewService.startYOffset();
  }

  get startScaleX() {
    return this.videoPreviewService.startScaleX();
  }

  get startScaleY() {
    return this.videoPreviewService.startScaleY();
  }
}
