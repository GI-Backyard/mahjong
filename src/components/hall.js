// let cc = window.cc;

export default class HallComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._createRoomDiag = null;
    this._joinRoomDiag = null;
  }

  start() {
    let app = this._engine;
    this._createRoomDiag = app.find(this.createRoomDiag);
    this._joinRoomDiag = app.find(this.joinRoomDiag);

    let en = app.find(this.createRoomBtn);
    let btn = en && en.getComp('Button');
    btn._clickListeners.push(() => {
      this._createRoomDiag.enabled = true;
    });

    en = app.find(this.joinRoomBtn);
    btn = en && en.getComp('Button');
    btn._clickListeners.push(() => {
      this._joinRoomDiag.enabled = true;
    });

    en = app.find(this.matchBtn);
    btn = en && en.getComp('Button');
    btn._clickListeners.push(() => {
      console.warn('Mahjong match not implemented.');
    });
  }

  update() {
  }
}
