import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { VideoService } from '../shared/video.service';
import { PreviewModalComponent } from '../preview-modal/preview-modal.component';
import { Video } from '../shared/video';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { VideoPreviewService } from '../shared/video-preview.service';

@Component({
  selector: 'vf-my-list',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, PreviewModalComponent, AsyncPipe],
  templateUrl: './my-list.component.html',
  styleUrl: './my-list.component.scss',
})
export class MyListComponent {
  private videoCards = viewChildren<ElementRef>('video');
  showPreviewOnHover = signal<boolean>(false);
  videoGenre = input.required<string>();
  private readonly videoPreviewService = inject(VideoPreviewService);
  private moduloBase = 6;

  video$: Observable<Video> = this.videoPreviewService.video$;

  videos = toSignal(inject(VideoService).getMyList());

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
