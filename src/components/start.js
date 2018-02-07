// let cc = window.cc;

export default class StartComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  getServerInfo() {
    let updateStatusInfo = (info) => {
      if (this._infoText) {
        this._infoText.label = info;
      }
    };
    
    let fnCheckNetwork = (timeOut) => {
      setTimeout(() => {
        updateStatusInfo('Connecting...');
        cc.vv.http.sendRequest("/get_serverinfo", null, (ret) => {
          if (!ret || ret.errcode != 0) {
            updateStatusInfo('Connection failed');
            fnCheckNetwork(5000);
          }
          else {
            cc.vv.SI = ret;
            updateStatusInfo('Connection Successed');
            this._loadingNode.enabled = true;
            this._canvas.enabled = false;
            console.log('Loading Process!');
          }
        });
      }, timeOut);
    };

    fnCheckNetwork(500);
  }

  start() {
    let app = this._app;
    this._logo = app.find('start_scene/logo');
    this._notice = app.find('start_scene/notice');
    this._splash = app.find('start_scene/splash');
    this._canvas = app.find('start_canvas');
    let nodeText = app.find('Text', this._canvas);
    this._infoText = nodeText && nodeText.getComp('Text');
    this._loadingNode = app.find('logic/loading');

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
          this.getServerInfo();
        }, 1000);
      }, 1000);
    }, 0);
  }

  destroy() {

  }
}

