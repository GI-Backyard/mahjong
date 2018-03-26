// let cc = window.cc;

export default class DemoStartComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._app;
    console.log('DemoStartComponent runs');
    let en = app.find(this.loadingText);
    let loadingText = en && en.getComp('Text');
    setTimeout(() => {
      loadingText.text = '正在进入场景...';
      setTimeout(() => {
        cc.game.loadScene("demo_mjRoom");
      }, 500);
    }, 2000);
  }
}

