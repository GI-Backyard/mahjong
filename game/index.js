
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

const { resl, path } = cc;

let assetsDir = './assets/mahjong-unity';
let startScene = 'start';

// init game
let game = new mahjong.Game(canvas);
game.resize();
game.init();
game.run();

// todo move this to game
resl({
  manifest: {
    assetInfos: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsDir}/assets.json`
    },

    scene: {
      type: 'text',
      parser: JSON.parse,
      src: `${assetsDir}/${startScene}.json`
    },
  },

  onDone(data) {
    const sceneJson = data.scene;
    const assetInfos = data.assetInfos;

    for (let uuid in assetInfos) {
      let info = assetInfos[uuid];
      for (let item in info.urls) {
        info.urls[item] = path.join(assetsDir, info.urls[item]);
      }

      game.assets.registerAsset(uuid, info);
    }

    cc.utils.parseLevel(
      game,
      sceneJson,
      (err, level) => {
        game.loadLevel(level);
      }
    );
  }
});
