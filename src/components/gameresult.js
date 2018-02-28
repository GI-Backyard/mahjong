// let cc = window.cc;

export default class GameResultComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._diag = null;
    this._mjGameNode = null;
  }

  start() {
    let app = this._app;
    this._mjGameNode = app.find(this.mjGameNode);
    this._diag = app.find(this.diag);
    let en = app.find('game_result/btn_ok', this._diag);
    let btn = en && en.getComp('Button');
    if (btn) {
      btn._clickListeners.push(() => {
        cc.game.loadScene('hall');
      })
    }

    this._mjGameNode.on('game_end', () => {
      this._diag.enabled = true;
    })
  }

}
