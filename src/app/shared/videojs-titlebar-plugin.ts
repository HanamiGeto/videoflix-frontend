import videojs, { VideoJsPlayer } from 'video.js';

const Component = videojs.getComponent('Component');

export class TitleBar extends Component {
  static defaultTitleBarOptions: VideoJsTitleBarOptions = {
    title: 'Title',
  };

  private titleBarComponentOptions: VideoJsTitleBarOptions;

  constructor(
    player: VideoJsPlayer,
    titleBarComponentOptions: Partial<VideoJsTitleBarOptions> = {},
  ) {
    super(player);

    this.titleBarComponentOptions = {
      ...TitleBar.defaultTitleBarOptions,
      ...titleBarComponentOptions,
    };

    this.addClass('vjs-control');
    this.addClass('vjs-title-bar');
    const titleContainer = this.addChild('Component');
    titleContainer.el().innerHTML = this.titleBarComponentOptions.title;
  }

  override createEl(tag = 'div', props = {}, attributes = {}) {
    const el = super.createEl(tag, props, attributes);
    return el;
  }
}

videojs.registerComponent('titleBar', TitleBar);

const Plugin = videojs.getPlugin('plugin');

export class VideoJsTitleBarPlugin extends Plugin {
  constructor(player: VideoJsPlayer, options?: VideoJsTitleBarOptions) {
    super(player, options);
    player.ready(() => {
      const customControlBar = player.getChild('CustomControlBar');
      const bottomControls = customControlBar?.getChild('BottomControls');
      if (bottomControls) {
        bottomControls.addChild(
          'titleBar',
          options,
          bottomControls.children().length - 3,
        );
      }
    });
  }
}

videojs.registerPlugin('titleBarPlugin', VideoJsTitleBarPlugin);

declare module 'video.js' {
  export interface VideoJsPlayer {
    titleBarPlugin: (
      options?: Partial<VideoJsTitleBarOptions>,
    ) => VideoJsTitleBarPlugin;
  }
  export interface VideoJsPlayerPluginOptions {
    titleBarPlugin?: Partial<VideoJsTitleBarOptions>;
  }
}

export interface VideoJsTitleBarOptions {
  title: string;
}
