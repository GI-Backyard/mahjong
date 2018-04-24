// let cc = window.cc;

export default class HallComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._app;

    let en = this.createRoomBtn;
    let btn = en && en.getComp('Button');
    btn._entity.on('clicked',() => {
      this._createRoomDiag.enabled = true;
    });

    en = this.joinRoomBtn;
    btn = en && en.getComp('Button');
    btn._entity.on('clicked',() => {
      this._joinRoomDiag.enabled = true;
    });

    en = this.matchBtn;
    btn = en && en.getComp('Button');
    btn._entity.on('clicked',() => {
      console.warn('Mahjong match not implemented.');
    });
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

HallComponent.schema = {
  createRoomBtn: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  joinRoomBtn: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  matchBtn: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  createRoomDiag: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  joinRoomDiag: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  userInfo: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },
}
