import {
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';
import '../shared/videojs-resolution-switcher-plugin';
import '../shared/videojs-custom-control-bar';

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
    customControls?: boolean;
  }>();
  player!: VideoJsPlayer;
  resolutionSources = input<{
    sources?: {
      src: string;
      type: string;
      label: string;
    }[];
  }>();

  ngOnInit(): void {
    this.player = videojs(
      this.videoPlayer()?.nativeElement,
      {
        ...this.options(),
        plugins: {
          qualityPlugin: { sources: this.resolutionSources()?.sources },
        },
      },
      () => {
        if (this.options().customControls) {
          this.player.addChild('CustomControlBar');
          this.player.removeClass('vjs-controls-disabled');
          this.player.removeChild(this.player.controlBar);
        }
      },
    );
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }
}
