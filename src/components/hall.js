// let cc = window.cc;

export default class HallComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._createRoomDiag = null;
    this._joinRoomDiag = null;
    this._userInfo = null;
  }

  start() {
    let app = this._app;
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
    this._userInfo = app.find(this.userInfo);
    this.showUserInfo();
  }

  showUserInfo() {
    // ,,this.sprHeadImg,cc.vv.userMgr.sex,cc.vv.userMgr.ip
    let app = this._app;
    let en = app.find('name', this._userInfo);
    let comp = en && en.getComp('Text');
    comp.text = cc.vv.userMgr.userName;
    en = app.find('id', this._userInfo);
    comp = en && en.getComp('Text');
    comp.text = `ID:${cc.vv.userMgr.userId}`;

    en = app.find('wealth/gems/Text', this._userInfo);
    comp = en && en.getComp('Text');
    comp.text = `${cc.vv.userMgr.gems}`;

    en = app.find('wealth/coins/Text', this._userInfo);
    comp = en && en.getComp('Text');
    comp.text = `${cc.vv.userMgr.coins}`;
  }

  tick() {
    if (cc.vv && cc.vv.userMgr.roomData != null) {
      var roomId = cc.vv.userMgr.roomData;
      cc.vv.userMgr.roomData = null;
      var fnEnter = function () {
        cc.vv.userMgr.enterRoom(roomId, function (ret) {
          //网络错误，需要反复重试
          if (ret.errcode <= -10000) {
            fnEnter();
          }
        });
      }
      fnEnter();
    }
  }
}
