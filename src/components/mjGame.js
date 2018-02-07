// let cc = window.cc;

export default class MJGameComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._main3D = null;
    this._mainUI = null;
    this._waitingUI = null;

    this._myHolds = [];
  }

  start() {
    // if (!cc.sys.isNative && cc.sys.isMobile) {
    //   var cvs = this.node.getComponent(cc.Canvas);
    //   cvs.fitHeight = true;
    //   cvs.fitWidth = true;
    // }
    if (!cc.vv) {
      cc.game.loadScene("loading");
      return;
    }
    // this.addComponent("NoticeTip");
    // this.addComponent("GameOver");
    // this.addComponent("DingQue");
    // this.addComponent("PengGangs");
    // this.addComponent("MJRoom");
    // this.addComponent("TimePointer");
    // this.addComponent("GameResult");
    // this.addComponent("Chat");
    // this.addComponent("Folds");
    // this.addComponent("ReplayCtrl");
    // this.addComponent("PopupMgr");
    // this.addComponent("HuanSanZhang");
    // this.addComponent("ReConnect");
    // this.addComponent("Voice");
    // this.addComponent("UserInfoShow");
    // this.addComponent("Status");

    this._initView();
    this._registerEventHandlers();

    this._main3D.enabled = false;
    this._mainUI.enabled = false;
    this._waitingUI.enabled = true;
    this._initWanfaLabel();
    this._onGameBeign();
    // cc.vv.audioMgr.playBGM("bgFight.mp3");
    // cc.vv.utils.addEscEvent(this.node);
  }

  _initView() {
    let app = this._app;
    this._main3D = app.find(this.main_3d);
    this._mainUI = app.find(this.main_ui);
    this._waitingUI = app.find(this.waiting_ui);

    // init holds
    let holds = app.find('mine/holds', this._main3D);
    for (let i = 0; i < holds.children.length; ++i) {
      this._myHolds.push(app.find(`tick${i}`, holds));
    }
    console.error(`_initView not finished.`)
  }

  _initWanfaLabel() {
    console.error(`_initWanfaLabel not finished.`)
  }

  _onGameBeign() {

    // this.tingBears = [];
    // this._tingBear.active = false;

    // var btnMoreN = this.node.getChildByName("btn_more");
    // var btnVoiceN = this.node.getChildByName("btn_voice");
    // var jushu = cc.find("game/mjcount", this.node); // 隐藏局数
    // var surplus = cc.find("game/gamecount", this.node);//隐藏剩余张数

    // this._ding_que_sc.clearQue();//开始清除缺的标记

    // btnMoreN.active = true;
    // btnVoiceN.active = true;
    // jushu.active = true;
    // surplus.active = true;


    // for (var i = 0; i < this._playEfxs.length; ++i) {
    //   this._playEfxs[i].node.active = false;
    // }

    // for (var i = 0; i < this._hupaiLists.length; ++i) {
    //   for (var j = 0; j < this._hupaiLists[i].childrenCount; ++j) {
    //     this._hupaiLists[i].children[j].active = false;
    //   }
    // }


    // this.hideChupai();
    // this.hideOptions();
    //↓重置右边、上、左、手中的牌
    // var sides = ["right", "up", "left"];
    // var gameChild = this.node.getChildByName("game");

    // for (var i = 0; i < sides.length; ++i) {
    //   var sideChild = gameChild.getChildByName(sides[i]);
    //   var holds = sideChild.getChildByName("holds");
    //   for (var j = 0; j < holds.childrenCount; ++j) {
    //     var nc = holds.children[j];
    //     nc.active = true;
    //     nc.scaleX = 1.0;
    //     nc.scaleY = 1.0;
    //     var sprite = nc.getComponent(cc.Sprite);
    //     sprite.spriteFrame = cc.vv.mahjongmgr.holdsEmpty[i + 1];
    //   }
    // }
    //↑

    // if (cc.vv.gameNetMgr.gamestate == 'baoting') {
    //   this.checkPreBaoTing();

    // }

    if (cc.vv.gameNetMgr.gamestate == "") {
      return;
    }

    this._main3D.enabled = true;
    this._mainUI.enabled = true;
    this._waitingUI.enabled = false;
    this.initMahjongs();
    // var seats = cc.vv.gameNetMgr.seats;
    // for (var i in seats) {
    //   var seatData = seats[i];
    //   var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
    //   if (localIndex != 0) {
    //     this.initOtherMahjongs(seatData);
    //     if (i == cc.vv.gameNetMgr.turn) {
    //       this.initMopai(i, -1);

    //     }
    //     else {
    //       this.initMopai(i, null);
    //     }
    //   }
    // }

    ///////////////////////
    // for (var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {
    //   var seatData = cc.vv.gameNetMgr.seats[i];
    //   var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
    //   var hupai = this._hupaiTips[localIndex];
    //   hupai.active = seatData.hued;
    //   if (seatData.hued) {
    //     if (cc.vv.gameNetMgr.conf.type == "xzdd") {
    //       var iszimo = false;
    //       for (var ix = 0; ix < seatData.huinfo.length; ix++) {
    //         if (seatData.huinfo[ix].pattern) {
    //           iszimo = true;
    //         }

    //       }
    //       hupai.getChildByName("sprHu").active = !iszimo;
    //       hupai.getChildByName("sprZimo").active = iszimo;
    //     } else {
    //       hupai.getChildByName("sprHu").active = true;
    //       hupai.getChildByName("sprZimo").active = false;
    //     }


    //   }

    //   if (seatData.huinfo) {
    //     for (var j = 0; j < seatData.huinfo.length; ++j) {
    //       var info = seatData.huinfo[j];
    //       if (info.pattern) {
    //         this.initHupai(i, info.pai);
    //       }
    //     }
    //   }
    // }
    // /////////////////
    // ///
    // this.showChupai();
    // if (cc.vv.gameNetMgr.gamestate == 'playing') {

    //   this.showAction(cc.vv.gameNetMgr.curaction);
    //   cc.vv.gameNetMgr.curaction = null;
    // }
    // if (cc.vv.gameNetMgr.conf.type == "hhmj") {
    //   this.checkQueYiMen(this.tingMaps);

    // }
    // this.initShowTingBear();

  }

  _registerSingleEventHandler(node, event, callback) {
    if (callback) {
      node.on(event, callback);
    } else {
      node.on(event, () => {
        console.warn(`event ${event} have no callback`);
      })
    }
  }

  _registerEventHandlers() {
    cc.vv.gameNetMgr.dataEventHandler = this._entity;
    let node = this._entity;

    this._registerSingleEventHandler(node, 'login_result', null);
    this._registerSingleEventHandler(node, 'hangang_notify', null);
    this._registerSingleEventHandler(node, 'gang_notify', null);
    this._registerSingleEventHandler(node, 'peng_notify', null);
    this._registerSingleEventHandler(node, 'game_dingque_finish', null);
    this._registerSingleEventHandler(node, 'guo_result', null);
    this._registerSingleEventHandler(node, 'guo_notify', null);
    this._registerSingleEventHandler(node, 'game_chupai_notify', null);
    this._registerSingleEventHandler(node, 'game_over', null);
    this._registerSingleEventHandler(node, 'game_num', () => {
      // todo
      // self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局";
      console.log("" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "局");
    });
    this._registerSingleEventHandler(node, 'mj_count', () => {
      // self._mjcount.string = "剩余" + cc.vv.gameNetMgr.numOfMJ + "张";
      // todo
      console.log("剩余" + cc.vv.gameNetMgr.numOfMJ + "张");
    });
    this._registerSingleEventHandler(node, 'hupai', null);
    this._registerSingleEventHandler(node, 'game_action', null);
    this._registerSingleEventHandler(node, 'game_mopai', null);
    this._registerSingleEventHandler(node, 'game_chupai', null);
    this._registerSingleEventHandler(node, 'game_sync', () => {
      this._initView();
      this._onGameBeign();
      this._checkIp();
    });
    this._registerSingleEventHandler(node, 'check_ip', () => {
      this._checkIp();
    });
    this._registerSingleEventHandler(node, 'game_begin', () => {
      this._onGameBeign();
      // check ip on first round
      if (cc.vv.gameNetMgr.numOfGames == 1) {
        this._checkIp();
      }
    });
    this._registerSingleEventHandler(node, 'game_holds', () => {
      this.initMahjongs();
    });
  }

  _checkIp() {
    if (cc.vv.gameNetMgr.gamestate == '') {
      return;
    }
    let selfData = cc.vv.gameNetMgr.getSelfData();
    let ipMap = {};
    for (let i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {
      let seatData = cc.vv.gameNetMgr.seats[i];
      if (seatData.ip != null && seatData.userid > 0 && seatData != selfData) {
        if (ipMap[seatData.ip]) {
          ipMap[seatData.ip].push(seatData.name);
        }
        else {
          ipMap[seatData.ip] = [seatData.name];
        }
      }
    }

    for (let k in ipMap) {
      let d = ipMap[k];
      if (d.length >= 2) {
        let str = "" + d.join("\n") + "\n\n正在使用同一IP地址进行游戏!";
        // cc.vv.alert.show("注意", str);
        // todo: show alert here
        console.warn(`${src}`);
        return;
      }
    }
  }

  initMahjongs() {
    let seats = cc.vv.gameNetMgr.seats;
    let seatData = seats[cc.vv.gameNetMgr.seatIndex];
    let holds = this.sortHolds(seatData);
    if (holds == null) {
      return;
    }

    //初始化手牌
    let lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
    window.g_myholds = this._myHolds;
    for (let i = 0; i < holds.length; ++i) {
      let mjid = holds[i];
      cc.vv.mahjongmgr.instantiateMjTile(mjid, (err, entity) => {
        if (!err && entity) {
          entity.setParent(this._myHolds[i]);
          this._myHolds[i].enabled = false;
          this._myHolds[i].enabled = true;
          entity.enabled = false;
          entity.enabled = true;
        }
      });
      // var sprite = this._myMJArr[i + lackingNum];
      // sprite.node.mjId = mjid;
      // sprite.node.y = 0;
      // this.setSpriteFrameByMJID("M_", sprite, mjid);
    }
    for (var i = 0; i < lackingNum; ++i) {
      // var sprite = this._myMJArr[i];
      // sprite.node.mjId = null;
      // sprite.spriteFrame = null;
      // sprite.node.active = false;
    }
    // for (var i = lackingNum + holds.length; i < this._myMJArr.length; ++i) {
    // var sprite = this._myMJArr[i];
    // sprite.node.mjId = null;
    // sprite.spriteFrame = null;
    // sprite.node.active = false;
    // }
    this.checkQueYiMen();
    console.error('initMahjongs function is not implemented');
  }

  sortHolds(seatData) {
    let holds = seatData.holds;
    if (holds == null) {
      return null;
    }
    //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
    let mopai = null;
    let l = holds.length;
    if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) {
      mopai = holds.pop();
    }

    let dingque = seatData.dingque;
    cc.vv.mahjongmgr.sortMJ(holds, dingque);

    //将摸牌添加到最后
    if (mopai != null) {
      holds.push(mopai);
    }

    return holds;
  }

  checkQueYiMen() {
    console.error('checkQueYiMen function is not implemented');
  }
}