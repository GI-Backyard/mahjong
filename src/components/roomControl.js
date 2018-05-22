// let cc = window.cc;

export default class RoomControlComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._dissolveAgree = null;
    this._dissolveReject = null;
    // show status of agree and reject
    this._endTime = 0;
    this._extraInfo = '';
    this._noticeLabel = null;
    this._gameBegin = false;
  }

  start() {
    let app = this._app;
    let noticeEn = app.find('content', this._dissolveBoard);
    this._noticeLabel = noticeEn && noticeEn.getComp('Text');
    let en = null;
    let btn = this._menu.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        let enabled = this._board.enabled;
        this._board.enabled = !enabled;
      });
    }

    en = app.find('btn_back', this._board);
    btn = en && en.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        this.onBtnBackClicked();
        // this._alertBoard.enabled = true;
      });
    }

    this._dissolveAgree = en = app.find('btn_agree', this._dissolveBoard);
    btn = en && en.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        this.onBtnAgreeDissolveClicked();
      });
    }

    this._dissolveReject = en = app.find('btn_reject', this._dissolveBoard);
    btn = en && en.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        this.onBtnRejectDissolveClicked();
      });
    }

    this.initEventHandlers();
  }

  initEventHandlers() {
    let node = this._mjGameNode;
    node.on("dissolve_notice", (event) => {
      console.log('aaaaaaaaaaa');
      var data = event;
      this.showDissolveNotice(data);
    });

    node.on("dissolve_cancel", (event) => {
      this.closeAll();
    });

    node.on('game_begin', () => {
      this._gameBegin = true;
    });

    node.on('game_over', () => {
      this._gameBegin = false;
    });
  }

  closeAll() {
    this._board.enabled = false;
    this._alertBoard.enabled = false;
    this._dissolveBoard.enabled = false;
  }

  showDissolveNotice(data) {
    this.closeAll();
    this._dissolveAgree.enabled = true;
    this._dissolveReject.enabled = true;
    this._dissolveBoard.enabled = true;
    this._endTime = Date.now() / 1000 + data.time;
    this._extraInfo = '';
    for (var i = 0; i < data.states.length; ++i) {
      var b = data.states[i];
      var name = cc.vv.gameNetMgr.seats[i].name;
      if (b) {
        this._extraInfo += name + " {同意}\n ";
        if (i == cc.vv.gameNetMgr.seatIndex) {
          this._dissolveAgree.enabled = false;
          this._dissolveReject.enabled = false;
          // this._dissolveStringNotice.active = true;
        }
      } else {
        this._extraInfo += name + " {...}\n ";
      }
    }
  }

  onBtnBackClicked() {
    if(this._gameBegin) {
      cc.vv.net.send("dissolve_request");
    } else {
      if(cc.vv.gameNetMgr.isOwner()) {
        if(!cc.vv.gameNetMgr.conf.for_others) {
          cc.vv.net.send("dispress");
        }
      } else {
        cc.vv.net.send("exit");
      }
    }
  }

  onBtnCancelClicked() {
    console.log('on btn cancel clicked.');
  }

  onBtnAgreeDissolveClicked() {
    cc.vv.net.send("dissolve_agree");
  }

  onBtnRejectDissolveClicked() {
    cc.vv.net.send("dissolve_reject");
  }

  tick() {
    if (this._endTime > 0) {
      var lastTime = this._endTime - Date.now() / 1000;
      if (lastTime < 0) {
        this._endTime = -1;
        lastTime = 0;
      }

      var m = Math.floor(lastTime / 60);
      var s = Math.ceil(lastTime - m * 60);

      var str = "";
      if (m > 0) {
        str += m + "m";
      }

      if (this._noticeLabel) {
        this._noticeLabel.text = str + s + "秒后自动解散房间\n " + this._extraInfo;
      }
    }
  }
}

RoomControlComponent.schema = {
  menu: {
    type: 'entity',
    default: null,
  },

  board: {
    type: 'entity',
    default: null,
  },

  alertBoard: {
    type: 'entity',
    default: null,
  },

  dissolveBoard: {
    type: 'entity',
    default: null,
  },

  mjGameNode: {
    type: 'entity',
    default: null,
  },
}
