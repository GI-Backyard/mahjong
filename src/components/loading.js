// let cc = window.cc;

export default class LoadingComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._loadingTime = 1000;
    this._accTime = 0;
    this._lastTime = undefined;

  }

  updateLoadingProgress() {
    let progress = (Math.min(1.0, this._accTime / this._loadingTime) * 100).toFixed();
    if(this._loadingProgressText) {
      this._loadingProgressText.label = `${progress}%`;
    }
  }

  start() {
    let app = this._engine;
    this._canvans = app.find('loading_canvas');
    this._canvans.enabled = true;
    this.updateLoadingProgress();
    let textNode = app.find('Text', this._canvans);
    this._loadingProgressText = textNode && textNode.getComp('Text');
    this._loginNode = app.find('logic/login');
  }

  update() {
    let time = Date.now();
    if (!this._lastTime) {
      this._lastTime = time;
    }
    this._accTime += time - this._lastTime;
    this._lastTime = time;
    this.updateLoadingProgress();
    if (this._accTime >= this._loadingTime) {
      this._entity.enabled = false;
      this._canvans.enabled = false;
      console.log('Loading Complete, to Login');
      this._loginNode.enabled = true;
    }
  }
}
