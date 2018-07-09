// let cc = window.cc;

export default class DemoStartComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._app;
    console.log('DemoStartComponent runs');
    let loadingText = this.loadingText && this.loadingText.getComp('Text');
    setTimeout(() => {
      if (loadingText) {
        loadingText.text = '正在进入场景...';
      }
      setTimeout(() => {
        cc.game.loadScene("demo_mjRoom");
      }, 500);
    }, 2000);
  }
}

DemoStartComponent.schema = {
  loadingText: {
    type: 'entity',
    default: null
  }
};