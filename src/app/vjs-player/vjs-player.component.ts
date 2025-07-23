import {
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import videojs, { VideoJsPlayer } from 'video.js';
import '../shared/videojs-resolution-switcher-plugin';
import '../shared/videojs-custom-control-bar';
import '../shared/videojs-titlebar-plugin';
import '../shared/videojs-back-button-plugin';
import '../shared/videojs-skip-buttons-plugin';
import { Router } from '@angular/router';

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
  private router = inject(Router);
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
  titleBar = input<{
    title: string;
  }>();

  ngOnInit(): void {
    this.player = videojs(
      this.videoPlayer()?.nativeElement,
      {
        ...this.options(),
        plugins: {
          videoQuality: { sources: this.resolutionSources()?.sources },
          titleBar: { title: this.titleBar()?.title },
          backButton: { router: this.router },
          skipButtons: { forward: 10, backwards: 10 },
        },
        userActions: {
          hotkeys: {
            muteKey(event) {
              return event.which === 77;
            },
            fullscreenKey(event) {
              return event.which === 70;
            },
            playPauseKey(event) {
              return event.which === 32;
            },
          },
        },
        controlBar: {
          volumePanel: {
            inline: false,
          },
        },
      },
      () => {
        if (this.options().customControls) {
          this.player.addChild('CustomControlBar');
          this.player.removeClass('vjs-controls-disabled');
          this.player.removeChild(this.player.controlBar);
          this.addVideoEventHandlers();
        }
      },
    );
  }

  ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
    }
  }

  private addVideoEventHandlers() {
    const videoElement = this.videoPlayer()?.nativeElement;

    if (videoElement) {
      videoElement.addEventListener('click', () => {
        if (this.player.paused()) {
          this.player.play();
        } else {
          this.player.pause();
        }
      });

      videoElement.addEventListener('dblclick', () => {
        if (this.player.isFullscreen()) {
          this.player.exitFullscreen();
        } else {
          this.player.requestFullscreen();
        }
      });
    }
  }
}
