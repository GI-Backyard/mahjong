// let cc = window.cc;

var COLOR_WHITE = null; //new cc.Color(255, 255, 255);
var COLOR_JING = null; //new cc.Color(128, 128, 128);

var isEmpty = function (map) {
  for (var k in map) {
    console.log(k);
    if (map[k] != null) {
      return false;
    }
  }
  return true;
}

//判断玩家手上有多少门
function computeTypeCount(sd) {
  //判断有几门
  var typeMap = {};
  var list = sd.holds.concat();
  list = list.concat(sd.pengs);
  list = list.concat(sd.diangangs);
  list = list.concat(sd.wangangs);
  list = list.concat(sd.angangs);

  for (var k in list) {
    var t = cc.vv.mahjongmgr.getMahjongType(list[k]);
    typeMap[t] = true;
  }

  var cnt = 0;
  for (var k in typeMap) {
    cnt++;
  }
  return cnt;
}

export default class MJGameComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._main3D = null;
    this._mainUI = null;
    this._waitingUI = null;

    this._myHoldsPai = [];
    this._myHolds = null;
    window.g_mjgame = this;
    this._queIndices = [];
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
      this._myHoldsPai.push(app.find(`tick${i}`, holds));
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
    var seats = cc.vv.gameNetMgr.seats;
    for (var i in seats) {
      var seatData = seats[i];
      var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
      if (localIndex != 0) {
        this.initOtherMahjongs(seatData);
        if (i == cc.vv.gameNetMgr.turn) {
          this.initMopai(i, -1);

        }
        else {
          this.initMopai(i, null);
        }
      }
    }

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
    this._registerSingleEventHandler(node, 'tile_clicked', (data) => {
      this.onMJClicked(data);
    })
    this._registerSingleEventHandler(node, 'login_result', null);
    this._registerSingleEventHandler(node, 'hangang_notify', null);

    this._registerSingleEventHandler(node, 'gang_notify', (data) => {
      let seatData = data.seatData;
      if (seatData.seatindex === cc.vv.gameNetMgr.seatIndex) {
        this.initMahjongs();
        console.log("自己碰牌");
        // self.showPointPand();//标记                
      }
      else {
        this.initOtherMahjongs(seatData);
      }
    });

    this._registerSingleEventHandler(node, 'peng_notify', (data) => {
      let seatData = data;
      if (seatData.seatindex === cc.vv.gameNetMgr.seatIndex) {
        this.initMahjongs();
        console.log("自己碰牌");
        // self.showPointPand();//标记                
      }
      else {
        this.initOtherMahjongs(seatData);
      }
    });

    this._registerSingleEventHandler(node, 'game_dingque_finish', () => {
      this.initMahjongs();
    });

    this._registerSingleEventHandler(node, 'guo_result', () => {
      this.hideOptions();
    });
    this._registerSingleEventHandler(node, 'guo_notify', (data) => {
      this.hideChupai();
      this.hideOptions();
      var seatData = data;
      //如果是自己，则刷新手牌
      if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
        this.initMahjongs();
      }
    });
    this._registerSingleEventHandler(node, 'game_chupai_notify', (data) => {
      this.hideChupai();
      var seatData = data.seatData;
      //如果是自己，则刷新手牌

      if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
        this.initMahjongs();

      }
      else {
        this.initOtherMahjongs(seatData);
        this.initMopai(seatData.seatindex, null);
      }
      this.showChupai();
      this.initShowTingBear();

      // var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.detail.pai);
      // cc.vv.audioMgr.playSFX(audioUrl, seatData.seatindex);
      //self._keep_out.active = false;
      //
      //
      // cc.vv.audioMgr.playSFX("give.mp3");
    });

    this._registerSingleEventHandler(node, 'game_over', () => {
      this._waitingUI.enabled = true;
      this._mainUI.enabled = false;
      this._main3D.enabled = false;
    });

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
    this._registerSingleEventHandler(node, 'game_action', (data) => {
      this.showAction(data);
    });
    this._registerSingleEventHandler(node, 'game_mopai', (data) => {
      this.hideChupai();
      // data = data.detail;
      var pai = data.pai;
      var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
      if (localIndex == 0) {
        // var index = 13;
        // let en = this._myHolds[13];
        cc.vv.mahjongmgr.instantiateMjTile(pai, (err, entity) => {
          if (!err && entity) {
            if (this._myHoldsPai[13].children.length === 1) {
              let oldChild = this._myHoldsPai[13].children[0];
              oldChild.setParent(null);
            } else {
              console.error('A fatal error for mopai exists!');
            }

            entity.setParent(this._myHoldsPai[13]);
            this._myHoldsPai[13].enabled = false;
            this._myHoldsPai[13].enabled = true;
            entity.enabled = false;
            entity.enabled = true;
            if(this.checkQue(pai)) {
              this._queIndices.push(13);
              entity.getComp('Model').material = cc.vv.mahjongmgr.getInactiveMtl();
            }
          }
        });
        // var sprite = self._myMJArr[index];
        // self.setSpriteFrameByMJID("M_", sprite, pai, index);
        // sprite.node.mjId = pai;
        // sprite.bd.active = cc.vv.gameNetMgr.isJing(pai);
      }
      // else if (cc.vv.replayMgr.isReplay()) {
      //   self.initMopai(data.seatIndex, pai);
      // }
    });
    this._registerSingleEventHandler(node, 'game_chupai', (data) => {
      this.hideChupai();
      this.checkQueYiMen();
      // self._keep_out.active = false;
      if (data.last != cc.vv.gameNetMgr.seatIndex) {
        if (cc.vv.gameNetMgr.getSelfData().isbaoting) {

        } else {

        }
        this.initShowTingBear();

      }

      if (/*!cc.vv.replayMgr.isReplay() && */data.turn != cc.vv.gameNetMgr.seatIndex) {
        this.initMopai(data.turn, -1);
      }
    });
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

  hideChupai() {
    // nothing to do here
    // console.error('mjGame hideChupai not implemented');
  }

  _checkIp() {
    if (cc.vv.gameNetMgr.gamestate == '') {
      return;
    }
    if (!cc.vv.gameNetMgr.conf.ipstrict) {
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

  getMJIndex(side, index) {
    if (side == "right" || side == "up") {
      return 13 - index;
    }
    return index;
  }

  initTingMap() {
    // this.tingMaps = null;

    // var ddd = cc.vv.gameNetMgr.getSelfData();
    // var holds = ddd.holds;
    // var lackingNum = (ddd.pengs.length + ddd.angangs.length + ddd.diangangs.length + ddd.wangangs.length) * 3;
    // if (lackingNum + ddd.holds.length != 14) {
    //   return;
    // }

    // //检查是否可听牌
    // var seatData = {
    //   tingMap: {},
    //   holds: new Array(holds.length),
    //   pengs: ddd.pengs,
    //   diangangs: ddd.diangangs,
    //   wangangs: ddd.wangangs,
    //   angangs: ddd.angangs,
    //   countMap: {}
    // }
    // for (var i = 0; i < holds.length; ++i) {
    //   var pai = holds[i];
    //   seatData.holds[i] = pai;
    //   var cnt = seatData.countMap[pai];
    //   if (cnt == null) {
    //     cnt = 0;
    //   }
    //   cnt++;
    //   seatData.countMap[pai] = cnt;
    // }

    // var jm = {};
    // for (var k in cc.vv.gameNetMgr.jings) {
    //   jm[cc.vv.gameNetMgr.jings[k]] = true;
    // }

    // //逐个检查
    // var tingMaps = {};
    // console.log(tingMaps == {});
    // for (var i = 0; i < seatData.holds.length; ++i) {
    //   var t = seatData.holds.shift();
    //   seatData.countMap[t]--;
    //   //↓排除缺一门的
    //   if (cc.vv.gameNetMgr.conf.type == "xlch" || cc.vv.gameNetMgr.conf.type == "xzdd") {
    //     var checkOK = false;
    //     for (var i0 = 0; i0 < seatData.holds.length; i0++) {
    //       var sprite = seatData.holds[i0];

    //       var tinged = this.checkQue(sprite);
    //       if (tinged) {
    //         checkOK = true;
    //         //break;
    //       }

    //     }

    //   }
    //   //↑
    //   if (tingMaps[t] == null && !checkOK) {
    //     cc.vv.mjutil.updateTingMap(jm, seatData);
    //     tingMaps[t] = seatData.tingMap;
    //   }
    //   seatData.holds.push(t);
    //   seatData.countMap[t]++;
    // }
    // console.log(tingMaps);
    // for (var k in tingMaps) {
    //   var map = tingMaps[k];
    //   if (isEmpty(map)) {
    //     tingMaps[k] = null;
    //   }
    // }
    // if (!isEmpty(tingMaps)) {
    //   this.tingMaps = tingMaps;
    // }
  }

  // 出牌堆
  showChupai() {
    let pai = cc.vv.gameNetMgr.chupai;
    console.log('chupai ' + pai);
    // if (pai >= 0) {

    //   if (cc.vv.gameNetMgr.chupai != -1 && cc.vv.gameNetMgr.gamestart) {//修改8.10
    //     if (cc.vv.gameNetMgr.seats) {
    //       var seatdata = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.turn]
    //       seatdata.folds.push(cc.vv.gameNetMgr.chupai);
    //       cc.vv.gameNetMgr.removemyfolds = false;
    //       this.node.emit("game_ation_chupai_notify", seatdata);
    //     }

    //   }
    //   var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
    //   var sprite = this._chupaiSprite[localIndex];

    //   var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
    //   sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);
    //   //sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_",pai);
    //   sprite.node.scaleX = 1.5;
    //   sprite.node.scaleY = 1.5;
    //   sprite.node.active = true;
    //   sprite.node.parent.active = true;
    //   sprite.node.parent.getComponent(cc.Animation).play("chupai");
    //   //sprite.node.active = false;   //修改8.10
    // }
  }

  addOption(btnName, pai) {
    // for (var i = 0; i < this._options.childrenCount; ++i) {
    //   var child = this._options.children[i];
    //   if (child.name == "op" && child.active == false) {
    //     child.active = true;
    //     var opTargetN = child.getChildByName("opTarget");
    //     var sprite = opTargetN.getComponent(cc.Sprite);

    //     if (btnName == "btnGang") {
    //       opTargetN.active = true;
    //       sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
    //     } else {
    //       opTargetN.active = false;

    //     }

    //     var btn = child.getChildByName(btnName);
    //     btn.active = true;
    //     btn.pai = pai;
    //     return;
    //   }
    // }
  }

  hideOptions(data) {
    // this._options.active = false;
    // for (var i = 0; i < this._options.childrenCount; ++i) {
    //   var child = this._options.children[i];
    //   if (child.name == "op") {
    //     child.active = false;
    //     child.getChildByName("btnPeng").active = false;
    //     child.getChildByName("btnGang").active = false;
    //     child.getChildByName("btnHu").active = false;
    //     child.getChildByName("btnTing").active = false;
    //     child.getChildByName("btnFeiTing").active = false;
    //   }
    // }
    // this.tingMaps = null;
  }

  showAction(data) {
    console.error('game actions callback not implemented.');
    // if (this._options.active) {
    //   this.hideOptions();
    // }

    // if (cc.vv.gameNetMgr.conf.type == 'ftmj' && this.tingMaps == null && !cc.vv.gameNetMgr.getSelfData().isbaoting && !cc.vv.replayMgr.isReplay()) {
    //   this.initTingMap();
    // }
    // else if (cc.vv.gameNetMgr.conf.type == 'hhmj' && this.tingMaps == null && cc.vv.gameNetMgr.turn == cc.vv.gameNetMgr.seatIndex && !cc.vv.replayMgr.isReplay()) {
    //   this.initTingMap();
    //   this.oldTingMaps = this.tingMaps;
    //   this.checkQueYiMen(this.tingMaps);
    // } else if (cc.vv.gameNetMgr.conf.type == 'xzdd' && this.tingMaps == null && !cc.vv.gameNetMgr.getSelfData().isbaoting && !cc.vv.replayMgr.isReplay()) {
    //   this.initTingMap();
    //   this.oldTingMaps = this.tingMaps;
    //   this.checkQueYiMen(this.tingMaps);
    // } else if (cc.vv.gameNetMgr.conf.type == 'xlch' && this.tingMaps == null && !cc.vv.gameNetMgr.getSelfData().isbaoting && !cc.vv.replayMgr.isReplay()) {
    //   this.initTingMap();
    //   this.oldTingMaps = this.tingMaps;
    //   this.checkQueYiMen(this.tingMaps);
    // }

    // this.onlyTingOP = data == null;
    // if (this.tingMaps && cc.vv.gameNetMgr.conf.type == 'ftmj') {
    //   if (data == null) {
    //     data = {};
    //   }
    //   data.ting = true;
    // }

    // if (data && (data.hu || data.gang || data.peng || data.ting)) {
    //   this._options.active = true;
    //   if (data.ting) {
    //     if (cc.vv.gameNetMgr.conf.sanbuduan == 0) {
    //       //三不断可听，任何情况都可以听。
    //       this.addOption("btnTing", data.pai);
    //     }
    //     else if (cc.vv.gameNetMgr.conf.sanbuduan == 1) {
    //       //三不断必飞的情况下，则断门才可以听，否则只能是飞听。
    //       var cnt = computeTypeCount(cc.vv.gameNetMgr.getSelfData());
    //       if (cnt != 3) {
    //         this.addOption("btnTing", data.pai);
    //       }
    //     }
    //     this.addOption("btnFeiTing", data.pai);
    //   }
    //   if (data.hu) {
    //     this.addOption("btnHu", data.pai);
    //   }
    //   if (data.peng) {
    //     this.addOption("btnPeng", data.pai);
    //   }

    //   if (data.gang) {
    //     for (var i = 0; i < data.gangpai.length; ++i) {
    //       var gp = data.gangpai[i];
    //       this.addOption("btnGang", gp);
    //     }
    //   }
    // }
  }

  showPointPand() {//显示提示打那张牌

    // if (cc.vv.gameNetMgr.conf.type == 'xzdd' || cc.vv.gameNetMgr.conf.type == 'xlch') {
    //   //检查听牌
    //   this.initTingMap();
    //   this.oldTingMaps = this.tingMaps;
    //   this.checkQueYiMen(this.tingMaps);


    // }
  }

  initHupai(seatIndex, pai) {
    // var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
    // if (cc.vv.gameNetMgr.conf.type == "xlch") {
    //   var hupailist = this._hupaiLists[localIndex];
    //   for (var i = 0; i < hupailist.children.length; ++i) {
    //     var hupainode = hupailist.children[i];
    //     if (hupainode.active == false) {
    //       var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
    //       hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);
    //       hupainode.active = true;
    //       break;
    //     }
    //   }
    // } else if (cc.vv.gameNetMgr.conf.type == "xzdd") {
    //   this.initMopai(seatIndex, pai);

    // }
  }

  playEfx(index, name) {
    // this._playEfxs[index].node.active = true;
    // this._playEfxs[index].play(name);
  }

  onMJClicked(data) {
    console.log(`(mjGame event handler)tile ${data.key} is picked!`);
    // console.log("点击了");
    if (cc.vv.gameNetMgr.isHuanSanZhang) {

      // this.node.emit("mj_clicked", event.target);
      return;
    }
    if (this._queIndices.length > 0 && this._queIndices.indexOf(data.index) === -1) {
      return;
    }

    //如果不是自己的回合，则忽略
    if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
      console.log("not your turn." + cc.vv.gameNetMgr.turn);
      return;
    }
    let seats = cc.vv.gameNetMgr.seats;
    let seatData = seats[cc.vv.gameNetMgr.seatIndex];
    let num = seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length;
    num = num * 3;
    for (let i = 0; i < this._myHoldsPai.length; ++i) {
      if (data.key === this._myHoldsPai[i].name) {
        if (this._selected && this._selected.name === data.key) {
          // console.log(`prepare to send pai ${data.key}`);
          this._selected.lpos.z += 2;
          this.shoot(this._myHolds[i - num]);
          this._selected = null;
        } else if ((!this._selected) || this._selected.name !== data.key) {
          if (this._selected) {
            this._selected.lpos.z += 2;
          }
          this._myHoldsPai[i].lpos.z -= 2;
          this._selected = this._myHoldsPai[i];
        } else {

        }

      }
    }

    // for (var i = 0; i < this._myMJArr.length; ++i) {
    //   if (event.target == this._myMJArr[i].node) {
    //     //如果是再次点击，则出牌
    //     if (event.target == this._selectedMJ) {
    //       this._keep_out.active = true;
    //       this.shoot(this._selectedMJ.mjId);
    //       this._selectedMJ.y = 0;
    //       this._selectedMJ = null;
    //       if (this.tingMode) {
    //         this.showTingBear();
    //       }

    //       return;
    //     }
    //     if (this._selectedMJ != null) {
    //       this._selectedMJ.y = 0;
    //     }
    //     event.target.y = 15;
    //     this._selectedMJ = event.target;
    //     if (this.tingMode) {
    //       this.onChooseTingPai(this._selectedMJ);
    //     }
    //     return;
    //   }
    // }
  }

  shoot(mjId) {
    if (mjId == null) {
      return;
    }
    cc.vv.gameNetMgr.tempchupai = mjId;//记录临时出牌
    cc.vv.net.send('chupai', mjId);

    // var seatData = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex];

    // if (cc.vv.gameNetMgr.conf.type == 'hhmj') {
    //   if (cc.vv.gameNetMgr.isJing(mjId)) {
    //     this._keep_out.active = false;
    //     return;
    //   }
    // }

    // if (cc.vv.gameNetMgr.conf.type == 'ftmj' && this.tingMode) {
    //   cc.vv.net.send('baoting', this.isFeiTing);
    // }
    // else if (cc.vv.gameNetMgr.conf.type == 'hhmj') {
    //   for (var i = 0; i < this._myMJArr.length; ++i) {
    //     var sprite = this._myMJArr[i];
    //     sprite.node.getChildByName("zs").active = false;
    //   }
    // }
    // this.showTingBear();
    // this._tingTip.active = false;
    // this._btnGuoTing.active = false;
    // this.oldTingMaps = null;
    // this.tingMaps = null;
    // this.tingMode = null;

    cc.vv.gameNetMgr.doTempChupai(mjId);//临时出牌
  }

  initMopai(seatIndex, pai) {
    let app = this._app;
    let localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
    let seatsIndices = ['mine', 'right', 'oppo', 'left'];
    let side = seatsIndices[localIndex];
    // var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);

    let sideRoot = app.find(side, this._main3D);
    let sideHolds = app.find("holds", sideRoot);

    let lastIndex = 13;
    let nc = sideHolds.children[lastIndex];

    // nc.scaleX = 1.0;
    // nc.scaleY = 1.0;

    if (pai == null) {
      nc.enabled = false;
    }
    else if (pai >= 0) {
      nc.enabled = true;
      console.error('init mopai tile not implemented');
      // nc.opacity = 255;
      // if (localIndex == 0) {
      //   nc.x = nc._yx;
      // }
      // todo real tile
      // var sprite = nc.getComponent(cc.Sprite);
      // sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);

      // if (sprite.bd) {
      //   sprite.bd.active = cc.vv.gameNetMgr.isJing(pai);
      // }
    }
    else if (pai != null) {
      nc.enabled = true;
      console.error('init mopai blank tile not implemented');
      // var sprite = nc.getComponent(cc.Sprite);
      // todo empty tile
      // sprite.spriteFrame = cc.vv.mahjongmgr.getHoldsEmptySpriteFrame(side);
    }
  }

  initEmptySprites(seatIndex) {
    // var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
    // var side = cc.vv.mahjongmgr.getSide(localIndex);
    // var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);

    // var gameChild = this.node.getChildByName("game");
    // var sideChild = gameChild.getChildByName(side);
    // var holds = sideChild.getChildByName("holds");
    // var spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
    // for (var i = 0; i < holds.childrenCount; ++i) {
    //   var nc = holds.children[i];
    //   nc.scaleX = 1.0;
    //   nc.scaleY = 1.0;

    //   var sprite = nc.getComponent(cc.Sprite);
    //   sprite.spriteFrame = spriteFrame;
    // }
  }

  initOtherMahjongs(seatData) {
    // return;
    //console.log("seat:" + seatData.seatindex);
    let app = this._app;
    var localIndex = this.getLocalIndex(seatData.seatindex);
    if (localIndex == 0) {
      return;
    }
    // var side = cc.vv.mahjongmgr.getSide(localIndex);
    // var game = this.node.getChildByName("game");
    // var sideRoot = game.getChildByName(side);
    // var sideHolds = sideRoot.getChildByName("holds");
    let seatsIndices = ['mine', 'right', 'oppo', 'left'];
    var side = seatsIndices[localIndex];
    var sideRoot = app.find(side, this._main3D);
    var sideHolds = app.find("holds", sideRoot);
    var num = seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length;
    num *= 3;
    let holdsPai = [];
    for (let i = 0; i < sideHolds.children.length; ++i) {
      holdsPai.push(app.find(`tick${i}`, sideHolds));
    }
    for (let i = 0; i < num; ++i) {
      // var idx = this.getMJIndex(side, i);
      holdsPai[i].enabled = false;
    }
    for (let i = num; i < holdsPai.length; ++i) {
      cc.vv.mahjongmgr.instantiateMjTile(0, (err, entity) => {
        if (!err && entity) {
          entity.setParent(holdsPai[i]);
          holdsPai[i].enabled = false;
          holdsPai[i].enabled = true;
          entity.enabled = false;
          entity.enabled = true;
        }
      });
    }

    // var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
    var holds = this.sortHolds(seatData);
    if (holds != null && holds.length > 0) {
      for (var i = 0; i < holds.length; ++i) {
        // var idx = this.getMJIndex(side, i + num);
        var idx = i + num;
        cc.vv.mahjongmgr.instantiateMjTile(holds[i], (err, entity) => {
          if (!err && entity) {
            entity.setParent(holdsPai[idx]);
            holdsPai[idx].enabled = false;
            holdsPai[idx].enabled = true;
            entity.enabled = false;
            entity.enabled = true;
          }
        });
      }

      if (holds.length + num == 13) {
        var lasetIdx = 13
        holdsPai[lasetIdx].enabled = false;
      }
    }
  }

  // 统计并且显示听牌张数
  initShowTingBear() {
    // //检查听牌
    // var ddd = cc.vv.gameNetMgr.getSelfData();
    // var holds = ddd.holds;
    // var seatData = {
    //   tingMap: {},
    //   holds: new Array(holds.length),
    //   pengs: ddd.pengs,
    //   diangangs: ddd.diangangs,
    //   wangangs: ddd.wangangs,
    //   angangs: ddd.angangs,
    //   countMap: {}
    // }
    // for (var i = 0; i < holds.length; ++i) {
    //   var pai = holds[i];
    //   seatData.holds[i] = pai;
    //   var cnt = seatData.countMap[pai];
    //   if (cnt == null) {
    //     cnt = 0;
    //   }
    //   cnt++;
    //   seatData.countMap[pai] = cnt;
    // }

    // var jm = {};
    // for (var k in cc.vv.gameNetMgr.jings) {
    //   jm[cc.vv.gameNetMgr.jings[k]] = true;
    // }

    // cc.vv.mjutil.updateTingMap(jm, seatData);
    // var tm = seatData.tingMap;

    // this.tingBears = [];
    // var hidx = 0;
    // for (var hp in tm) {
    //   if (tm[hp] != null) {
    //     //排序查看剩余值
    //     var restmj = 4;

    //     for (var i = 0; i < cc.vv.gameNetMgr.seats.length; i++) {
    //       for (var j in cc.vv.gameNetMgr.seats[i].folds) {//查看打出的牌
    //         if (cc.vv.gameNetMgr.seats[i].folds[j] == hp) {
    //           restmj--;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].pengs) {//查看碰的牌
    //         if (cc.vv.gameNetMgr.seats[i].pengs[j] == hp) {
    //           restmj -= 3;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].angangs) {//查看暗杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].angangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].diangangs) {//查看点杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].diangangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].wangangs) {//查看wang杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].wangangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //     }
    //     for (var k in cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].holds) {//查看自己手中的牌
    //       if (cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].holds[k] == hp) {
    //         restmj--;
    //       }
    //     }
    //     if (cc.vv.gameNetMgr.conf.type == 'hhmj') {
    //       if (cc.vv.gameNetMgr.jings.length > 0) {
    //         var jing = cc.vv.gameNetMgr.jings[0];
    //         var banzi = jing - 1;
    //         if (jing >= 0 && jing < 9) {
    //           if (banzi < 0) {
    //             banzi = 8;
    //           }
    //         }
    //         else if (jing >= 9 && jing < 18) {
    //           if (banzi < 9) {
    //             banzi = 17;
    //           }
    //         }
    //         else if (jing >= 18 && jing < 27) {
    //           if (banzi < 18) {
    //             banzi = 26;
    //           }
    //         }

    //         if (banzi == hp) {
    //           restmj--;
    //         }
    //       }
    //     }

    //     this.tingBears.push({ id: hp, restmj: restmj });
    //     //排序查看剩余值                       
    //   }
    // }
    // this.showTingBear();
  }

  // 显示听牌张数
  showTingBear() {
    ////////显示有叫
    // if (this.tingBears.length > 0 && this.tingMode !== null) {
    //   // this._tingBear.active =false;
    //   var hps = this._tingBear.getChildByName("child");
    //   hps.width = 100;
    //   for (var i = 0; i < hps.childrenCount; i++) {
    //     hps.children[i].active = false;
    //   }
    //   for (var i in this.tingBears) {
    //     var hpnode = hps.children[i];
    //     hpnode.active = true;
    //     hpnode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", this.tingBears[i].id);
    //     if (this.tingBears[i].restmj <= 0) {
    //       hpnode.getChildByName("num").getComponent(cc.Label).string = 0;
    //     } else {
    //       hpnode.getChildByName("num").getComponent(cc.Label).string = this.tingBears[i].restmj;
    //     }
    //   }

    //   this._tingBear.active = true;

    // }
    // else {
    //   this._tingBear.active = false;
    // }
  }

  initMahjongs() {
    this._queIndices.length = 0;
    let seats = cc.vv.gameNetMgr.seats;
    let seatData = seats[cc.vv.gameNetMgr.seatIndex];
    let holds = this._myHolds = this.sortHolds(seatData);
    if (holds == null) {
      return;
    }

    //初始化手牌
    let lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
    for (let i = 0; i < 14; ++i) {
      if (this._myHoldsPai[i].children.length === 1) {
        this._myHoldsPai[i].children[0].setParent(null);
      } else if (this._myHoldsPai[i].children.length !== 0) {
        console.error(`Fatal error in pai ${i}`);
      }
    }
    for (let i = 0; i < holds.length; ++i) {
      let mjid = holds[i];
      cc.vv.mahjongmgr.instantiateMjTile(mjid, (err, entity) => {
        if (!err && entity) {
          this._myHoldsPai[i + lackingNum].children.length = 0;
          entity.setParent(this._myHoldsPai[i + lackingNum]);
          this._myHoldsPai[i + lackingNum].enabled = false;
          this._myHoldsPai[i + lackingNum].enabled = true;
          entity.enabled = false;
          entity.enabled = true;
        }
        if (this.checkQue(mjid)) {
          this._queIndices.push(i + lackingNum);
          entity.getComp('Model').material = cc.vv.mahjongmgr.getInactiveMtl();
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

  //需要改写的地方
  setSpriteFrameByMJID(pre, sprite, mjid) {
    console.error('setSpriteFrameByMJID need to be reimplemented');
    // sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
    // sprite.node.active = true;
    // sprite.node.x = sprite.node._yx;
  }

  checkPreBaoTing() {
    // if (cc.vv.gameNetMgr.getSelfData().isbaoting) {
    //   return;
    // }
    // var holds = cc.vv.gameNetMgr.getSelfData().holds;

    // //检查是否可听牌
    // var seatData = {
    //   tingMap: {},
    //   holds: new Array(holds.length),
    //   countMap: {}
    // }
    // for (var i = 0; i < holds.length; ++i) {
    //   var pai = holds[i];
    //   seatData.holds[i] = pai;
    //   var cnt = seatData.countMap[pai];
    //   if (cnt == null) {
    //     cnt = 0;
    //   }
    //   cnt++;
    //   seatData.countMap[pai] = cnt;
    // }

    // if (seatData.holds.length == 13) {
    //   cc.vv.mjutil.updateTingMap({}, seatData);
    //   if (!isEmpty(seatData.tingMap)) {
    //     this.tingMaps = 'pre_bao_ting';
    //     this.showAction();
    //   }
    // }
  }

  //如果玩家手上还有缺的牌没有打，则只能打缺牌, 在听牌的时候，设置指示器，表示打对应牌可以听牌
  checkQueYiMen(tingMaps) {
    //   this.tingMode = tingMaps != null;
    //   //this.tingBears = [];
    //   let type = null;
    //   if (cc.vv.gameNetMgr.conf) {
    //     type = cc.vv.gameNetMgr.conf.type;
    //   }

    //   if (type == 'hhmj') {
    //     for (var i = 0; i < this._myMJArr.length; ++i) {
    //       var sprite = this._myMJArr[i];
    //       if (sprite.node.mjId != null && sprite.node.active) {
    //         sprite.bd.active = cc.vv.gameNetMgr.isJing(sprite.node.mjId);
    //       }
    //       sprite.zs.active = false;
    //     }
    //     /////
    //     if (this.tingMode) {
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           var b = tingMaps[sprite.node.mjId] != null;
    //           if (b) {
    //             sprite.node.getChildByName("zs").active = true;
    //           }
    //           else {
    //             sprite.node.getChildByName("zs").active = false;
    //           }
    //         }
    //       }
    //     }
    //     //////
    //   }
    //   else if (type == 'ftmj') {
    //     if (this.tingMode) {
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           var b = tingMaps[sprite.node.mjId] != null;
    //           sprite.node.getComponent(cc.Button).interactable = b;
    //           if (b) {
    //             sprite.node.color = COLOR_WHITE;
    //             if (!cc.vv.gameNetMgr.getSelfData().isbaoting) {
    //               sprite.node.getChildByName("zs").active = true;
    //             }

    //           }
    //           else {
    //             sprite.node.color = COLOR_JING;
    //             sprite.node.getChildByName("zs").active = false;
    //           }
    //         }
    //       }
    //     }
    //     else {
    //       var tinged = cc.vv.gameNetMgr.getSelfData().isbaoting;
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           sprite.node.getComponent(cc.Button).interactable = !tinged;
    //           if (tinged) {
    //             sprite.node.color = COLOR_JING;
    //             sprite.node.getChildByName("zs").active = false;
    //           }
    //           else {
    //             sprite.node.color = COLOR_WHITE;
    //             sprite.node.getChildByName("zs").active = false;

    //           }
    //         }
    //       }
    //     }
    //   }
    //   else if (type == 'xzdd' || type == 'xlch') {
    //     console.log("seats", cc.vv.gameNetMgr.seats);
    //     console.log("tingMode", this.tingMode);
    //     //
    //     for (var i = 0; i < this._myMJArr.length; ++i) {
    //       var sprite = this._myMJArr[i];
    //       if (sprite.node.mjId != null && sprite.node.active) {
    //         sprite.bd.active = cc.vv.gameNetMgr.isJing(sprite.node.mjId);
    //       }
    //       sprite.zs.active = false;
    //     }
    //     /////
    //     if (this.tingMode) {//设置上标
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           var b = tingMaps[sprite.node.mjId] != null;
    //           if (b) {
    //             sprite.node.getChildByName("zs").active = true;
    //           }
    //           else {
    //             sprite.node.getChildByName("zs").active = false;
    //           }
    //         }
    //       }
    //     }

    //     var isDingQueing = cc.vv.gameNetMgr.isDingQueing;
    //     if (!isDingQueing) {
    //       //真机调试
    //       if (cc.debug) {
    //         cc.debug.addBug("已定缺:" + cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].dingque);
    //       }
    //       var checkState = [];
    //       var checkOK = false;
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           var tinged = this.checkQue(sprite.node.mjId);
    //           if (cc.debug) {
    //             cc.debug.addBug("麻将id" + sprite.node.mjId + "检查缺牌:" + this.checkQue(sprite.node.mjId));
    //           }
    //           if (tinged) {
    //             checkOK = true;
    //           }

    //           checkState[i] = tinged;
    //         }
    //       }
    //       //真机调试
    //       if (cc.debug) {
    //         cc.debug.addBug("是否有缺牌:" + checkOK + "checkState" + checkState);
    //       }
    //       for (var i = 0; i < 14; ++i) {
    //         var sprite = this._myMJArr[i];
    //         if (sprite.node.active == true) {
    //           var tinged = checkState[i];
    //           if (cc.debug) {
    //             cc.debug.addBug("本张牌是否缺:i:" + i + "," + tinged);
    //           }
    //           if (tinged && checkOK) {//设置颜色

    //             sprite.node.color = COLOR_JING;
    //             //sprite.node.getChildByName("zs").active = false;
    //           }
    //           else {
    //             sprite.node.color = COLOR_WHITE;
    //             //sprite.node.getChildByName("zs").active = false;
    //           }

    //           if (checkOK) {
    //             sprite.node.getComponent(cc.Button).interactable = tinged;
    //           } else if (cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].hued) {
    //             if (i != 13) {
    //               sprite.node.getComponent(cc.Button).interactable = false;
    //               sprite.node.getChildByName("zs").active = false;
    //             } else {
    //               sprite.node.color = COLOR_JING;
    //             }
    //           }
    //           else {
    //             sprite.node.getComponent(cc.Button).interactable = true;
    //           }
    //         }
    //       }
    //     }
    //   }
  }

  getLocalIndex(index) {
    return cc.vv.gameNetMgr.getLocalIndex(index);
  }

  // 貌似没有用
  onOptionClicked(event) {
    // console.log(event.target.pai);
    // if (event.target.name == "btnPeng") {
    //   cc.vv.net.send("peng");
    // }
    // else if (event.target.name == "btnGang") {
    //   cc.vv.net.send("gang", event.target.pai);
    // }
    // else if (event.target.name == "btnHu") {
    //   cc.vv.net.send("hu");
    // }
    // else if (event.target.name == "btnGuo") {
    //   if (cc.vv.gameNetMgr.gamestate == 'baoting') {
    //     cc.vv.net.send("guo");
    //     this.tingMaps = null;
    //   }
    //   else if (this.onlyTingOP) {
    //     this.hideOptions();
    //   }
    //   else {
    //     cc.vv.net.send("guo");

    //   }
    // }
    // else if (event.target.name == "btnTing" || event.target.name == "btnFeiTing") {
    //   this.oldTingMaps = this.tingMaps;
    //   this.isFeiTing = event.target.name == "btnFeiTing";
    //   if (cc.vv.gameNetMgr.gamestate == 'baoting') {
    //     cc.vv.net.send("baoting", this.isFeiTing);
    //     this.oldTingMaps = null;
    //     this.tingMaps = null;
    //   }
    //   else {
    //     this._btnGuoTing.active = true;
    //     if (!this.onlyTingOP) {
    //       cc.vv.net.send("guo");
    //     }
    //   }

    //   this.checkQueYiMen(this.tingMaps);
    //   this.hideOptions();
    // }
    // else if (event.target.name == "btnGuoTing") {
    //   this._btnGuoTing.active = false;
    //   this._tingTip.active = false;
    //   //this._tingBear.active = false;
    //   this.oldTingMaps = null;
    //   this.tingMaps = null;
    //   this.checkQueYiMen();
    // }
  }

  // 显示听牌数目
  onChooseTingPai(paiNode) {
    // this._tingTip.active = true;
    // this._tingTip.x = paiNode.x;
    // if (paiNode.x > 0) {
    //   this._tingTip.anchorX = 1;
    // }
    // else {
    //   this._tingTip.anchorX = 0;
    // }
    // var pai = paiNode.mjId;
    // var tm = this.oldTingMaps[pai];
    // var hps = this._tingTip
    // hps.active = false;
    // for (var i = 0; i < hps.childrenCount; i++) {
    //   hps.children[i].active = false;
    // }
    // this.tingBears = [];
    // var hidx = 0;
    // for (var hp in tm) {
    //   if (tm[hp] != null) {

    //     hps.active = true;
    //     var hpnode = hps.children[hidx];
    //     hpnode.active = true;
    //     hpnode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", hp);
    //     hidx++;
    //     //排序查看剩余值
    //     var restmj = 4;

    //     for (var i = 0; i < cc.vv.gameNetMgr.seats.length; i++) {
    //       for (var j in cc.vv.gameNetMgr.seats[i].folds) {//查看打出的牌
    //         if (cc.vv.gameNetMgr.seats[i].folds[j] == hp) {
    //           restmj--;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].pengs) {//查看碰的牌
    //         if (cc.vv.gameNetMgr.seats[i].pengs[j] == hp) {
    //           restmj -= 3;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].angangs) {//查看暗杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].angangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].diangangs) {//查看点杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].diangangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //       for (var j in cc.vv.gameNetMgr.seats[i].wangangs) {//查看wang杠的牌
    //         if (cc.vv.gameNetMgr.seats[i].wangangs[j] == hp) {
    //           restmj -= 4;
    //           break;
    //         }
    //       }
    //     }
    //     for (var k in cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].holds) {//查看自己手中的牌
    //       if (cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].holds[k] == hp) {
    //         restmj--;
    //       }
    //     }

    //     if (cc.vv.gameNetMgr.conf.type == 'hhmj') {
    //       if (cc.vv.gameNetMgr.jings.length > 0) {
    //         var jing = cc.vv.gameNetMgr.jings[0];
    //         var banzi = jing - 1;
    //         if (jing >= 0 && jing < 9) {
    //           if (banzi < 0) {
    //             banzi = 8;
    //           }
    //         }
    //         else if (jing >= 9 && jing < 18) {
    //           if (banzi < 9) {
    //             banzi = 17;
    //           }
    //         }
    //         else if (jing >= 18 && jing < 27) {
    //           if (banzi < 18) {
    //             banzi = 26;
    //           }
    //         }

    //         if (banzi == hp) {
    //           restmj--;
    //         }
    //       }
    //     }
    //     if (restmj <= 0) {
    //       hpnode.getChildByName("num").getComponent(cc.Label).string = 0;
    //     } else {
    //       hpnode.getChildByName("num").getComponent(cc.Label).string = restmj;
    //     }
    //     this.tingBears.push({ id: hp, restmj: restmj });
    //     //排序查看剩余值                       
    //   }
    // }
    // if (hidx >= 11) {
    //   this._tingTip.width = 895;
    // }
    // else {
    //   this._tingTip.width = 10 + 10 + (hidx - 1) * 5 + hidx * 75;
    // }
  }

  // 游戏下拉菜单
  onBtnMore() {
    // var moreBoard = cc.find("Canvas/btn_more_board");
    // if (moreBoard.active) {
    //   moreBoard.active = false;

    // }
    // else {
    //   moreBoard.active = true;
    // }
  }

  // 解散或者退出房间
  onBtnBackClicked() {
    //var prepare = cc.find("Canvas/prepare");
    // cc.info("prepare", prepare.active);
    // if (cc.vv.gameNetMgr.numOfGames <= 0) {
    //   if (cc.vv.gameNetMgr.isOwner()) {
    //     if (cc.vv.gameNetMgr.conf.for_others) {
    //       cc.find('Canvas/special_alert').active = true;
    //     }
    //     else {
    //       cc.vv.alert.show("解散房间", "解散房间不扣钻石，是否确定解散？", function () {
    //         cc.vv.net.send("dispress");
    //       }, true);
    //     }
    //   }
    //   else {
    //     cc.vv.alert.show("退出房间", "是否要退出房间？", function () {
    //       cc.vv.net.send("exit");
    //     }, true);
    //   }
    // } else {
    //   cc.vv.alert.show("申请解散房间", "是否要申请解散房间！", function () {
    //     cc.vv.net.send("dissolve_request");
    //   }, true);

    // }
  }

  // 检查是否为定缺
  checkQue(num) {
    num = parseInt(num);
    switch (parseInt(cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.seatIndex].dingque)) {
      case 0:// 同
        if (num >= 0 && num <= 8) {
          return true;
        } else {
          return false;
        }
        break;
      case 1://条
        if (num >= 9 && num <= 17) {
          return true;
        } else {
          return false;
        }
        break;
      case 2://万
        if (num >= 18 && num <= 26) {
          return true;
        } else {
          return false;
        }
        break;
    }
  }
}