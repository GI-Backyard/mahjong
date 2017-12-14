export default class StartComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._engine;
    this._logo = app.find('3d/logo');
    this._notice = app.find('3d/notice');
    this._splash = app.find('3d/splash');
    this._canvas = app.find('Canvas');

    setTimeout(() => {
      this._logo.enabled = true;
      this._notice.enabled = false;
      this._splash.enabled = false;
      setTimeout(() => {
        this._logo.enabled = false;
        this._notice.enabled = true;
        setTimeout(() => {
          this._notice.enabled = false;
          this._splash.enabled = true;
          this._canvas.enabled = true;
        }, 1000);
      }, 1000);
    }, 0);
  }

  destroy() {

  }
}

