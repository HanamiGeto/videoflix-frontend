import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { previewModalAnimation } from '../shared/animations';
import { Video } from '../shared/video';
import { AnimationEvent } from '@angular/animations';
import { NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { VideoService } from '../shared/video.service';
import { TooltipDirective } from '../shared/tooltip.directive';

@Component({
  selector: 'vf-preview-modal',
  standalone: true,
  imports: [NgStyle, RouterLink, TooltipDirective],
  templateUrl: './preview-modal.component.html',
  styleUrl: './preview-modal.component.scss',
  animations: [previewModalAnimation],
})
export class PreviewModalComponent {
  videoRemoved = output<Video>();
  video = input.required<Video>();
  startXOffset = input.required<number>();
  startYOffset = input.required<number>();
  startScaleX = input.required<number>();
  startScaleY = input.required<number>();
  currentStylesContainer = input.required<Record<string, string>>();
  currentStylesContent = input.required<Record<string, string>>();
  isPreviewVisible = false;
  private videoService = inject(VideoService);
  private router = inject(Router);
  isVideoInMyList = signal(false);

  constructor() {
    effect(() => {
      if (this.video()) {
        this.videoService
          .isVideoInMyList(this.video().id)
          .subscribe((isInList) => {
            this.isVideoInMyList.set(isInList);
          });
      }
    });
  }

  onAnimationEvent(event: AnimationEvent): void {
    if (event.phaseName === 'done') {
      this.isPreviewVisible = !this.isPreviewVisible;
    }
  }

  updateVideoList(video: Video): void {
    const isInMyList = this.isVideoInMyList();
    const isNotOnBrowsePage = this.router.url !== '/browse';

    if (isInMyList && isNotOnBrowsePage) {
      this.removeFromList(video);
      return;
    }

    this.toggleVideoInList(video, isInMyList);
  }

  private removeFromList(video: Video): void {
    this.isVideoInMyList.set(false);
    this.videoRemoved.emit(video);
  }

  private toggleVideoInList(video: Video, isInMyList: boolean): void {
    this.isVideoInMyList.set(!isInMyList);
    this.videoService.updateMyList(video).subscribe();
  }
}
