
export default class DemoPointerComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._app;
    console.log('DemoStartComponent runs');
    let en = app.find(this.pointerParent);
    let kong = app.find('kong', en);
    let pointerArray = [];
    let dong = app.find('dong', en);
    let nan = app.find('nan', en);
    let xi = app.find('xi', en);
    let bei = app.find('bei', en);
    pointerArray.push(dong);
    pointerArray.push(bei);
    pointerArray.push(xi);
    pointerArray.push(nan);
    // kong.enabled = false;
    let lastTurn = -1;
    // pointerArray[lastTurn].enabled = true;
    let turnChange = () => {
      if (lastTurn !== -1) {
        pointerArray[lastTurn].enabled = false;
      } else {
        kong.enabled = false;
      }
      lastTurn = (lastTurn + 1) % pointerArray.length;
      pointerArray[lastTurn].enabled = true;
      setTimeout(turnChange, 2000);
    }
    setTimeout(turnChange, 2000);
  }
}

