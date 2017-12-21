let cc = window.cc;

export default class LoginComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._engine;
    this._canvas = app.find('login_canvas');
    this._canvas.enabled = true;
    let guestLoginNode = app.find('Image', this._canvas);
    this._guestLoginBtn = guestLoginNode.getComp('Button');
    this._guestLoginBtn._clickListeners.push(() => {
      this.onGuestAuth();
    });
    cc.vv.http.url = cc.vv.http.master_url;
    cc.vv.net.addHandler('push_need_create_role', function () {
      console.log("onLoad:push_need_create_role");
      cc.director.loadScene("createrole");
    });

  }

  onGuestAuth() {
    cc.vv.userMgr.guestAuth();
    this._guestLoginBtn._clickListeners.length = 0;
    this._guestLoginBtn._clickListeners.push(() => {
      console.warn('Already logined');
    });
  }

}