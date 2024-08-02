import videojs, { VideoJsPlayer } from 'video.js';
import { Router } from '@angular/router';

const Component = videojs.getComponent('Component');

export class BackButton extends Component {
  private router: Router;

  constructor(player: VideoJsPlayer, options: { router: Router }) {
    super(player);
    this.router = options.router;
    this.addClass('vjs-back-button');
    this.on('click', () => {
      this.player().pause();
      setTimeout(() => {
        this.router.navigate(['/browse']);
      }, 10);
    });
  }

  override createEl() {
    const el = videojs.dom.createEl('a', {
      innerHTML: '<img src="arrow-121-32.png" alt="Back to Home">',
    });
    return el;
  }
}

videojs.registerComponent('BackButton', BackButton);

const Plugin = videojs.getPlugin('plugin');

export class BackButtonPlugin extends Plugin {
  constructor(player: VideoJsPlayer, options: { router: Router }) {
    super(player, options);
    player.ready(() => {
      const customControlBar = player.getChild('CustomControlBar');
      const bottomControls = customControlBar?.getChild('BottomControls');
      if (bottomControls) {
        bottomControls.addChild(
          'BackButton',
          options,
          bottomControls.children().length - 1,
        );
      }
    });
  }
}

videojs.registerPlugin('backButtonPlugin', BackButtonPlugin);

declare module 'video.js' {
  export interface Component {
    backButtonComponent: (options?: Partial<BackButtonOptions>) => BackButton;
  }
  export interface ComponentOptions {
    backButtonComponent?: Partial<BackButtonOptions>;
  }
}

export interface BackButtonOptions {
  router?: Router;
}
