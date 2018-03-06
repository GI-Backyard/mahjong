// let cc = window.cc;
const dummiesSpriteName = ['hu', 'peng', 'gang', 'guo'];
export default class GameActionsComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._optionsNode = [];
    this._optionsSprite = [];
  }

  start() {
    let app = this._app;
    let optRoot = app.find(this.optionsNode);
    let index = 0;
    while (index < 10) {
      let opt = app.find(`op_${index}`, optRoot);
      if (opt) {
        this._optionsNode.push(opt);
      } else {
        break;
      }
      ++index;
    }
    // console.log(`${index} optsNode in game`);

    // dummies
    let dummyRoot = app.find('dummies', optRoot);
    for (let index = 0; index < dummiesSpriteName.length; ++index) {
      let en = app.find(dummiesSpriteName[index], dummyRoot);
      let imagComp = en.getComp('Image');
      this._optionsSprite[index] = imagComp.sprite;
    }

    if (cc.vv.gameNetMgr.gamestate == 'playing') {

      this.updateOptions(cc.vv.gameNetMgr.curaction);
      cc.vv.gameNetMgr.curaction = null;
    }

    let gameNode = app.find(this.mjGameNode);
    gameNode.on("game_action", (data) => {
      this.updateOptions(data);
    });
  }

  updateOptions(data) {
    this.clearOptions();
    let ops = [];
    if (!data) {
      return;
    }
    if (data.hu) {
      ops.push('hu');
    }
    if (data.gang) {
      ops.push('gang');
    }
    if (data.peng) {
      ops.push('peng');
    }
    if (ops.length > 0) {
      ops.push('guo');
    }
    for (let i = 0; i < ops.length; ++i) {
      this._optionsNode[i].enabled = true;
      let img = this._optionsNode[i].getComp('Image');
      img.sprite = this._optionsSprite[dummiesSpriteName.indexOf(ops[i])];
      // update eventmgr
      let btn = this._optionsNode[i].getComp('Button');
      btn._clickListeners.push(() => {
        this.onOptsClicked(ops[i]);
      });
    }
  }

  onOptsClicked(opt) {
    if (opt === 'guo') {
      cc.vv.net.send('guo');
      this.clearOptions();
    } else if (opt === 'peng') {
      cc.vv.net.send('peng');
    } else if (opt === 'gang') {
      cc.vv.net.send('gane');
    } else if (opt === 'hu') {
      cc.vv.net.send('hu');
    } else {
      console.warn(`opt ${opt} not recognized.`);
    }
  }

  clearOptions() {
    for (let i = 0; i < this._optionsNode.length; ++i) {
      this._optionsNode[i].enabled = false;
      let btn = this._optionsNode[i].getComp('Button');
      btn._clickListeners.length = 0;
    }
  }

}