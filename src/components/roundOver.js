// let cc = window.cc;
export default class RoundOverComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._isGameEnd = false;
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode;

    let btn = this._okBtn && this._okBtn.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        if (this._isGameEnd) {
          this._gameResultUI.active = true;
        }
        else {
          cc.vv.net.send('ready');
        }
        this._uiRoot.active = false;
      })
    }

    node.on('game_over', (data) => {
      this.onGameOver(data);
    });

    node.on('game_end', (data) => {
      this._isGameEnd = true;
    });
  }

  onGameOver(data) {
    this._uiRoot.active = true;
  }
}

RoundOverComponent.schema = {
  mjGameNode: {
    type: 'entity',
    default: null,
  },

  uiRoot: {
    type: 'entity',
    default: null,
  },

  okBtn: {
    type: 'entity',
    default: null,
  },

  gameResultUI: {
    type: 'entity',
    default: null,
  },
}