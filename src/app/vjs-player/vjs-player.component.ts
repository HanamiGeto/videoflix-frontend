import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';
import '../shared/videojs-resolution-switcher';
import '../shared/videojs-custom-wraper';

@Component({
  selector: 'vf-vjs-player',
  standalone: true,
  imports: [],
  template: `
    <video
      #videoPlayer
      class="video-js"
      muted
      playsinline
      preload="none"
    ></video>
  `,
  styleUrl: './vjs-player.component.scss',
})
export class VjsPlayerComponent implements OnInit, OnDestroy {
  private readonly videoPlayer = viewChild<ElementRef>('videoPlayer');
  options = input.required<{
    fluid?: boolean;
    autoplay: boolean;
    sources: {
      src: string;
      type: string;
    }[];
    fill?: boolean;
    controls?: boolean;
  }>();
  player!: VideoJsPlayer;

  ngOnInit(): void {
    this.player = videojs(this.videoPlayer()?.nativeElement, {
      ...this.options(),
    });
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
