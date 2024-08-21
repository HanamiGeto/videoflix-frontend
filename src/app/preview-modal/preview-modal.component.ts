import { Component, inject, input } from '@angular/core';
import { previewModalAnimation } from '../shared/animations';
import { Video } from '../shared/video';
import { AnimationEvent } from '@angular/animations';
import { NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService } from '../shared/video.service';

@Component({
  selector: 'vf-preview-modal',
  standalone: true,
  imports: [NgStyle, RouterLink],
  templateUrl: './preview-modal.component.html',
  styleUrl: './preview-modal.component.scss',
  animations: [previewModalAnimation],
})
export class PreviewModalComponent {
  video = input.required<Video>();
  startXOffset = input.required<number>();
  startYOffset = input.required<number>();
  startScaleX = input.required<number>();
  startScaleY = input.required<number>();
  currentStylesContainer = input.required<Record<string, string>>();
  currentStylesContent = input.required<Record<string, string>>();
  isPreviewVisible = false;
  private videoService = inject(VideoService);

  onAnimationEvent(event: AnimationEvent): void {
    if (event.phaseName === 'done') {
      this.isPreviewVisible = !this.isPreviewVisible;
    }
  }

  updateVideoList(video: Video): void {
    this.videoService.updateMyList(video).subscribe((updatedVideoList) => {
      console.log(updatedVideoList);
    });
  }
}
