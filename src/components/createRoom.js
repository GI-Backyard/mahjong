// let cc = window.cc;
let _gameType = ['xzdd', 'xlch'];
export default class createRoomComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._conf = {
      type: _gameType[0],
      for_others: false,
      difen: 0,
      zimo: 0,
      jiangdui: true,
      huansanzhang: false,
      zuidafanshu: 0,
      jushuxuanze: 0,
      dianganghua: 0,
      menqing: true,
      tiandihu: true,
      aa: 0,
      ipstrict: false,
    };
  }

  _registerToggleGroup(app, groupName, toggles, callbacks) {
    let en, comp, checkComp;
    let group;
    checkComp = null;
    en = groupName;
    group = en && en.getComp('ToggleGroup');
    for (let i = 0; i < toggles.length; ++i) {
      en = toggles[i];
      comp = en && en.getComp('Toggle');
      if (callbacks[i]) {
        comp._entity.on('change',callbacks[i]);
      }
      comp.toggleGroup = group;
      checkComp = checkComp || comp;
    }

    checkComp.checked = true;
  }

  _registerSingleToggle(app, name, toggled, callback) {
    let en = name;
    let comp = en && en.getComp('Toggle');
    if (callback) {
      comp._entity.on('change', callback);
    }

    if (toggled) {
      comp.checked = true;
    } else {
      comp.checked = false;
    }
  }

  _registerBtn(app, name, callback) {
    let en = name;
    let comp = en && en.getComp('Button');
    if (callback) {
      comp._entity.on('clicked', callback);
    }
  }

  start() {
    let app = this._app;
    let en = this._closeBtn
    let btn = en && en.getComp('Button');
    btn._entity.on('clicked', () => {
      this.closeDiag();
    });

    // appy wanfa
    this._registerToggleGroup(app, this.wanfaGroup, [this.xzddToggle, this.xlchToggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.type = _gameType[0];
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.type = _gameType[1];
        }
      }]);

    // apply pay
    this._registerToggleGroup(app, this.payGroup, [this.payfzToggle, this.payaaToggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.aa = 0;
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.aa = 1;
        }
      }
    ]);

    // apply round
    this._registerToggleGroup(app, this.roundGroup, [this.round4Toggle, this.round8Toggle, this.round16Toggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.jushuxuanze = 0;
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.jushuxuanze = 1;
        }

      }, (e) => {
        if (e.component.checked) {
          this._conf.jushuxuanze = 2;
        }
      }
    ]);

    // apply times
    this._registerToggleGroup(app, this.timesGroup, [this.time2Toggle, this.time3Toggle, this.time4Toggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.zuidafanshu = 0;
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.zuidafanshu = 1;
        }

      }, (e) => {
        if (e.component.checked) {
          this._conf.zuidafanshu = 2;
        }
      }
    ]);

    // apply zm
    this._registerToggleGroup(app, this.zimoGroup, [this.zimojdToggle, this.zimojfToggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.zimo = 0;
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.zimo = 1;
        }
      }
    ]);

    // apply dian gang hua
    this._registerToggleGroup(app, this.dghGroup, [this.dghfpToggle, this.dghzmToggle], [
      (e) => {
        if (e.component.checked) {
          this._conf.dianganghua = 0;
        }
      }, (e) => {
        if (e.component.checked) {
          this._conf.dianganghua = 1;
        }
      }
    ]);

    // apply single toggles
    this._registerSingleToggle(app, this.hszToggle, this._conf.huansanzhang, (e) => {
      if (e.component.checked) {
        this._conf.huansanzhang = true;
      } else {
        this._conf.huansanzhang = false;
      }
    });
    this._registerSingleToggle(app, this.yjjdToggle, this._conf.jiangdui, (e) => {
      if (e.component.checked) {
        this._conf.jiangdui = true;
      } else {
        this._conf.jiangdui = false;
      }
    });
    this._registerSingleToggle(app, this.mqzzToggle, this._conf.menqing, (e) => {
      if (e.component.checked) {
        this._conf.menqing = true;
      } else {
        this._conf.menqing = false;
      }
    });
    this._registerSingleToggle(app, this.tdhToggle, this._conf.tiandihu, (e) => {
      if (e.component.checked) {
        this._conf.tiandihu = true;
      } else {
        this._conf.tiandihu = false;
      }
    });
    this._registerSingleToggle(app, this.fzbToggle, this._conf.ipstrict, (e) => {
      if (e.component.checked) {
        this._conf.ipstrict = true;
      } else {
        this._conf.ipstrict = false;
      }
    });

    this._registerBtn(app, this.createRoomBtn, () => {
      this.onCreateBtnClicked();
    });

    this._registerBtn(app, this.createRoomForOthersBtn, () => {
      this.onCreateBtnForOthersClicked();
    });
  }

  onCreateBtnClicked() {
    this._conf.for_others = false;
    this._createRoom(this._conf);
    console.log('create room btn clicked');
  }

  onCreateBtnForOthersClicked() {
    this._conf.for_others = true;
    this._createRoom(this._conf);
    console.log('create room for others btn clicked');
  }

  _createRoom(conf) {
    let self = this;
    let type = this._conf.type;
    let forOthers = conf.for_others;
    let data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      conf: JSON.stringify(conf)
    };
    console.log(data);

    let onCreate = function (ret) {
      if (ret.errcode !== 0) {
        //console.log(ret.errmsg);
        if (ret.errcode == 2222) {
          cc.vv.wc.hide();
          // cc.vv.alert.show("提示", "钻石不足，创建房间失败!");
          console.error(`钻石不足，创建房间失败!`);
        }
        //网络错误，重试。
        else if (ret.errcode <= -10000) {
          cc.vv.http.sendRequest("/create_private_room", data, onCreate);
        }
        else {
          cc.vv.wc.hide();
          console.error(`创建房间失败,错误码: + ${ret.errcode}`);
          // cc.vv.alert.show("提示", "创建房间失败,错误码:" + ret.errcode);
        }
      }
      else {
        if (!forOthers) {
          cc.vv.userMgr.enterRoom(ret.roomid);
        }
        else {
          cc.vv.wc.hide();
          // self._alert.active = true;
          // var lblContent = self._alert.getChildByName('content').getComponent(cc.Label);
          // lblContent.string = '创建成功！房间号 ：' + ret.roomid;
        }
      }
    };

    cc.vv.wc.show("正在创建房间");
    cc.vv.http.sendRequest("/create_private_room", data, onCreate);
  }

  openDiag() {
    if (this._diag) {
      this._diag.active = true;
    }
  }

  closeDiag() {
    if (this._diag) {
      this._diag.active = false;
    }
  }

  tick() {
  }
}

createRoomComponent.schema = {
  closeBtn: {
    type: 'entity',
    default: null,
  },

  diag: {
    type: 'entity',
    default: null,
  },

  wanfaGroup: {
    type: 'entity',
    default: null,
  },

  xzddToggle: {
    type: 'entity',
    default: null,
  },

  xlchToggle: {
    type: 'entity',
    default: null,
  },

  payGroup: {
    type: 'entity',
    default: null,
  },

  payfzToggle: {
    type: 'entity',
    default: null,
  },

  payaaToggle: {
    type: 'entity',
    default: null,
  },

  roundGroup: {
    type: 'entity',
    default: null,
  },

  round4Toggle: {
    type: 'entity',
    default: null,
  },

  round8Toggle: {
    type: 'entity',
    default: null,
  },

  round16Toggle: {
    type: 'entity',
    default: null,
  },

  timesGroup: {
    type: 'entity',
    default: null,
  },

  time2Toggle: {
    type: 'entity',
    default: null,
  },

  time3Toggle: {
    type: 'entity',
    default: null,
  },

  time4Toggle: {
    type: 'entity',
    default: null,
  },

  zimoGroup: {
    type: 'entity',
    default: null,
  },

  zimojdToggle: {
    type: 'entity',
    default: null,
  },

  zimojfToggle: {
    type: 'entity',
    default: null,
  },

  dghGroup: {
    type: 'entity',
    default: null,
  },

  dghfpToggle: {
    type: 'entity',
    default: null,
  },

  dghzmToggle: {
    type: 'entity',
    default: null,
  },

  hszToggle: {
    type: 'entity',
    default: null,
  },

  yjjdToggle: {
    type: 'entity',
    default: null,
  },

  mqzzToggle: {
    type: 'entity',
    default: null,
  },

  tdhToggle: {
    type: 'entity',
    default: null,
  },

  fzbToggle: {
    type: 'entity',
    default: null,
  },

  createRoomBtn: {
    type: 'entity',
    default: null,
  },

  createRoomForOthersBtn: {
    type: 'entity',
    default: null,
  },
}
