// let cc = window.cc;

export default class joinRoomComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._diag = null;
  }

  start() {
    let app = this._engine;
    let en = app.find(this.closeBtn);
    let btn = en && en.getComp('Button');
    btn._clickListeners.push(() => {
      this.closeDiag();
    });

    this._diag = app.find(this.diag);
  }

  openDiag() {
    if (this._diag) {
      this._diag.enabled = true;
    }
  }

  closeDiag() {
    if (this._diag) {
      this._diag.enabled = false;
    }
  }

  update() {
  }
}
