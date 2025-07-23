import videojs, { VideoJsPlayer } from 'video.js';

const Component = videojs.getComponent('Component');

export class ForwardButton extends Component {
  private forward: number;

  constructor(player: VideoJsPlayer, options: { forward: number }) {
    super(player);
    this.forward = options.forward;
    this.addClass('vjs-control');
    this.addClass('vjs-skip-buttons');
    this.on('click', () => {
      this.player().currentTime(this.player().currentTime() + this.forward);
    });
  }

  override createEl() {
    const el = videojs.dom.createEl('button', {
      innerHTML: '<img src="forward_10.png" alt="Forward 10 Seconds">',
    });
    return el;
  }
}

videojs.registerComponent('forwardButton', ForwardButton);

export class BackwardsButton extends Component {
  private backwards: number;

  constructor(player: VideoJsPlayer, options: { backwards: number }) {
    super(player);
    this.backwards = options.backwards;
    this.addClass('vjs-control');
    this.addClass('vjs-skip-buttons');
    this.on('click', () => {
      this.player().currentTime(this.player().currentTime() - this.backwards);
    });
  }

  override createEl() {
    const el = videojs.dom.createEl('button', {
      innerHTML: '<img src="replay_10.png" alt="Backwards 10 Seconds">',
    });
    return el;
  }
}

videojs.registerComponent('backwardsButton', BackwardsButton);

const Plugin = videojs.getPlugin('plugin');

export class SkipButtonsPlugin extends Plugin {
  constructor(player: VideoJsPlayer, options?: SkipButtonOptions) {
    super(player, options);
    player.ready(() => {
      const customControlBar = player.getChild('CustomControlBar');
      const bottomControls = customControlBar?.getChild('BottomControls');
      if (bottomControls) {
        bottomControls.addChild(
          'forwardButton',
          options,
          bottomControls.children().length - 5,
        );
        bottomControls.addChild(
          'backwardsButton',
          options,
          bottomControls.children().length - 6,
        );
      }
    });
  }
}

videojs.registerPlugin('skipButtons', SkipButtonsPlugin);

export interface SkipButtonOptions {
  forward: number;
  backward: number;
}
