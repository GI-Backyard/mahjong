// let cc = window.cc;
export default class RoundOverComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._mjGameNode = null;
    this._roundUI = null;
    this._okBtn = null;
    this._gameResultUI = null;
    this._isGameEnd = false;
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode = app.find(this.mjGameNode);
    this._roundUI = app.find(this.uiRoot);
    this._okBtn = app.find(this.okBtn);
    this._gameResultUI = app.find(this.gameResultUI);

    let btn = this._okBtn && this._okBtn.getComp('Button');
    if (btn) {
      btn._clickListeners.push(() => {
        if (this._isGameEnd) {
          this._gameResultUI.enabled = true;
        }
        else {
          cc.vv.net.send('ready');
        }
        this._roundUI.enabled = false;
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
    this._roundUI.enabled = true;
  }

}