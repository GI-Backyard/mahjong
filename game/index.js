
let view = document.getElementById('view');

// create new canvas
let canvas = document.createElement('canvas');
canvas.classList.add('fit');
canvas.tabIndex = -1;
view.appendChild(canvas);

const { resl, path } = cc;

let assetsDir = './assets/mahjong-unity';
let startScene = 'start';
let startComponent = 'game.start';

// init app
let app = new cc.App(canvas);
app.resize();
app.run();
let game = new mahjong.Game(app);
game.init();

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

      app.assets.registerAsset(uuid, info);
    }

    cc.utils.parseLevel(
      app,
      sceneJson,
      (err, level) => {
        app.loadLevel(level);
        let node = app.find('3d');
        node.addComp(startComponent);
      }
    );
  }
});
