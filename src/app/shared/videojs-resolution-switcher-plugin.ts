import videojs, { VideoJsPlayer } from 'video.js';

const Button = videojs.getComponent('Button');
const Component = videojs.getComponent('Component');

class VideoJsQualityComponent extends Button {
  static defaultItemOptions: QualityOptions = {
    label: 'Quality',
    src: '',
  };

  qualityOptions: QualityOptions;

  constructor(
    player: VideoJsPlayer,
    qualityOptions: Partial<QualityOptions> = {},
  ) {
    super(player);

    this.qualityOptions = {
      ...VideoJsQualityComponent.defaultItemOptions,
      ...qualityOptions,
    };

    this.on('click', () => {
      player.src({ src: this.qualityOptions.src, type: 'video/mp4' });
      player.play();
      player.trigger('qualitychange', this.qualityOptions.label);
    });
    this.el().innerHTML = this.qualityOptions.label;
    this.addClass('vjs-resolution-item');
  }

  override createEl(tag = 'button', props = {}, attributes = {}) {
    const el = super.createEl(tag, props, attributes);
    return el;
  }

  setActive(active: boolean) {
    if (active) {
      this.addClass('vjs-resolution-item-active');
    } else {
      this.removeClass('vjs-resolution-item-active');
    }
  }
}

videojs.registerComponent('QualityComponent', VideoJsQualityComponent);

export class VideoJsQualityButton extends Component {
  static defaultButtonOptions: VideoJsQualityButtonOptions = {
    label: 'Quality',
    sources: [],
  };

  private qualityComponentOptions: VideoJsQualityButtonOptions;
  private currentQuality: string;

  constructor(
    player: VideoJsPlayer,
    qualityComponentOptions: Partial<VideoJsQualityButtonOptions> = {},
  ) {
    super(player);

    this.qualityComponentOptions = {
      ...VideoJsQualityButton.defaultButtonOptions,
      ...qualityComponentOptions,
    };

    this.currentQuality = this.qualityComponentOptions.sources[2].label;
    this.addClass('vjs-control');
    this.addClass('vjs-resolution-panel');
    this.addClass('vjs-resolution-panel-vertical');
    this.createMenu();
    this.updateActiveItems();
  }

  override createEl(tag = 'div', props = {}, attributes = {}) {
    const el = super.createEl(tag, props, attributes);
    return el;
  }

  private createMenu() {
    const resLabel = this.addChild('Component', {
      className: 'res-label',
    });

    resLabel.el().innerHTML = this.currentQuality;

    const wrapper = this.addChild('Component', {
      className: 'vjs-resolution-control vjs-resolution-vertical',
    });

    this.qualityComponentOptions.sources.forEach((source) => {
      wrapper.addChild('QualityComponent', source);
      wrapper.getChild('QualityComponent')?.on('click', () => {
        this.currentQuality = source.label;
        resLabel.el().innerHTML = this.currentQuality;
        this.updateActiveItems();
      });
    });

    const customControlBar = this.player_.getChild('CustomControlBar');
    const topControls = customControlBar?.getChild('TopControls');

    this.on('mouseenter', () => {
      this.addClass('vjs-hover');
      topControls?.addClass('hide-top-controls');
    });

    this.on('mouseleave', () => {
      this.removeClass('vjs-hover');
      topControls?.removeClass('hide-top-controls');
    });
  }

  private updateActiveItems() {
    const wrapper = this.getChild('Component');
    const items = wrapper?.children() as VideoJsQualityComponent[];
    items.forEach((item) => {
      item.setActive(item.qualityOptions.label === this.currentQuality);
    });
  }
}

videojs.registerComponent('qualityButton', VideoJsQualityButton);

const Plugin = videojs.getPlugin('plugin');

export class VideoJsQualityPlugin extends Plugin {
  constructor(player: VideoJsPlayer, options?: VideoJsQualityButtonOptions) {
    super(player, options);
    player.ready(() => {
      const customControlBar = player.getChild('CustomControlBar');
      const bottomControls = customControlBar?.getChild('BottomControls');
      if (bottomControls) {
        bottomControls.addChild(
          'qualityButton',
          options,
          bottomControls.children().length - 1,
        );
      }
    });
  }
}

videojs.registerPlugin('qualityPlugin', VideoJsQualityPlugin);

declare module 'video.js' {
  export interface VideoJsPlayer {
    qualityPlugin: (
      options?: Partial<VideoJsQualityButtonOptions>,
    ) => VideoJsQualityPlugin;
  }
  export interface VideoJsPlayerPluginOptions {
    qualityPlugin?: Partial<VideoJsQualityButtonOptions>;
  }
  export interface Component {
    qualityComponent: (
      options?: Partial<QualityOptions>,
    ) => VideoJsQualityComponent;
  }
  export interface ComponentOptions {
    qualityComponent?: Partial<QualityOptions>;
  }
}

export interface VideoJsQualityButtonOptions {
  label?: string;
  sources: { src: string; type: string; label: string }[];
}

export interface QualityOptions {
  label: string;
  src: string;
}
