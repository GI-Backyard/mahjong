
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

const { resl, path } = cc;

let assetsDir = './assets/mahjong-unity';
let assetsFile = 'assets.json';
let scenes = './scenes.json';

// init game
let game = cc.game = new mahjong.Game(canvas);
game.resize();
game.init();
game.run();

// todo move this to game
resl({
  manifest: {
    assetInfos: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsDir}/${assetsFile}`
    },

    scenes: {
      type: 'text',
      parser: JSON.parse,
      src: scenes
    },
  },

  onDone(data) {
    const sceneJson = data.scenes;
    const assetInfos = data.assetInfos;

    for (let uuid in assetInfos) {
      let info = assetInfos[uuid];
      for (let item in info.urls) {
        info.urls[item] = path.join(assetsDir, info.urls[item]);
      }

      game.assets.registerAsset(uuid, info);
    }
    game.setScenes(sceneJson);
    game.loadScene('start');
  }
});
