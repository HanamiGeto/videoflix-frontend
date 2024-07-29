import videojs, { VideoJsPlayer } from 'video.js';

const Component = videojs.getComponent('Component');

class TopControls extends Component {
  constructor(player: VideoJsPlayer) {
    super(player);
  }
  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-top-controls',
    });
  }
}

videojs.registerComponent('TopControls', TopControls);

class BottomControls extends Component {
  constructor(player: VideoJsPlayer) {
    super(player);
  }
  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-bottom-controls',
    });
  }
}

videojs.registerComponent('BottomControls', BottomControls);

const ControlBar = videojs.getComponent('ControlBar');

class CustomControlBar extends ControlBar {
  constructor(player: VideoJsPlayer) {
    super(player);

    const topControlsComponents: videojs.Component[] = [];
    const bottomControlsComponents: videojs.Component[] = [];

    this.children().forEach((child: videojs.Component) => {
      if (
        child.name() === 'ProgressControl' ||
        child.name() === 'RemainingTimeDisplay'
      ) {
        topControlsComponents.push(child);
      } else {
        bottomControlsComponents.push(child);
      }
    });

    topControlsComponents.concat(bottomControlsComponents).forEach((child) => {
      this.removeChild(child);
    });

    const topControls = this.addChild('TopControls');
    const bottomControls = this.addChild('BottomControls');

    topControlsComponents.forEach((child) => {
      topControls.addChild(child);
    });

    bottomControlsComponents.forEach((child) => {
      bottomControls.addChild(child);
    });
  }

  override createEl() {
    return videojs.dom.createEl('div', {
      className: 'vjs-custom-control-bar',
      dir: 'ltr',
    });
  }
}

videojs.registerComponent('CustomControlBar', CustomControlBar);
