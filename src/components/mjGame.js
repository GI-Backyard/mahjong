// let cc = window.cc;

export default class MJGameComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._main3D = null;
    this._mainUI = null;
    this._waitingUI = null;
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

    // this.gameRoot.active = false;
    // this.prepareRoot.active = true;
    this._initWanfaLabel();
    this._onGameBeign();
    // cc.vv.audioMgr.playBGM("bgFight.mp3");
    // cc.vv.utils.addEscEvent(this.node);
  }

  _initView() {
    let app = this._engine;
    this._main3D = app.find(this.main_3d);
    this._mainUI = app.find(this.main_ui);
    this._waitingUI = app.find(this.waiting_ui);
    this._main3D.enabled = false;
    this._mainUI.enabled = false;
    this._waitingUI.enabled = true;
    window.mj_3d = this._main3D;
    console.error(`_initView not finished.`)
  }

  _initWanfaLabel() {
    console.error(`_initWanfaLabel not finished.`)
  }

  _onGameBeign() {
    console.error(`_onGameBeign not finished.`)
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
    this._registerSingleEventHandler(node, 'game_sync', null);
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
      this.checkQueYiMen();
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
    var seats = cc.vv.gameNetMgr.seats;
    var seatData = seats[cc.vv.gameNetMgr.seatIndex];
    var holds = this.sortHolds(seatData);
    if (holds == null) {
      return;
    }

    //初始化手牌
    var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
    for (var i = 0; i < holds.length; ++i) {
      var mjid = holds[i];
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
    for (var i = lackingNum + holds.length; i < this._myMJArr.length; ++i) {
      // var sprite = this._myMJArr[i];
      // sprite.node.mjId = null;
      // sprite.spriteFrame = null;
      // sprite.node.active = false;
    }
    console.error('initMahjongs function is not implemented');
  }

  sortHolds(seatData) {
    console.error('initMahjongs function is not implemented');
  }
  checkQueYiMen() {
    console.error('checkQueYiMen function is not implemented');
  }

  _onGameBeign() {
    console.error('onGameBeign function is not implemented');
  }
}