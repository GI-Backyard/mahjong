
// let cc = window.cc;

export default {
  dataEventHandler: null,
  roomId: null,
  maxNumOfGames: 0,
  numOfGames: 0,
  numOfMJ: 0,
  seatIndex: -1,
  seats: null,
  turn: -1,
  button: -1,
  dingque: -1,
  chupai: -1,
  isDingQueing: false,
  isHuanSanZhang: false,
  gamestate: "",
  isOver: false,
  dissoveData: null,
  gamestart: true,
  // 是否已经删除folds
  removemyfolds: true,
  // 临时出牌，记录
  tempchupai: null,

  reset: function () {
    this.turn = -1;
    this.chupai = -1;
    this.dingque = -1;
    this.button = -1;
    this.gamestate = "";
    this.dingque = -1;
    this.isDingQueing = false;
    this.isHuanSanZhang = false;
    this.curaction = null;
    this.jings = null;
    this.tijiao = 0;
    this.lastChuPaiTurn = -1;
    for (var i = 0; i < this.seats.length; ++i) {
      this.seats[i].holds = [];
      this.seats[i].folds = [];
      this.seats[i].pengs = [];
      this.seats[i].angangs = [];
      this.seats[i].diangangs = [];
      this.seats[i].wangangs = [];
      this.seats[i].dingque = -1;
      this.seats[i].ready = false;
      this.seats[i].hued = false;
      this.seats[i].isbaoting = false;
      this.seats[i].huanpais = null;
      this.seats[i].huaMap = null;
      this.huanpaimethod = -1;
    }
  },

  clear: function () {
    this.dataEventHandler = null;
    if (this.isOver == null) {
      this.seats = null;
      this.roomId = null;
      this.maxNumOfGames = 0;
      this.numOfGames = 0;
    }
  },

  dispatchEvent(event, data) {
    if (this.dataEventHandler) {
      this.dataEventHandler.emit(event, data);
    }
  },

  getSeatIndexByID: function (userId) {
    for (var i = 0; i < this.seats.length; ++i) {
      var s = this.seats[i];
      if (s.userid == userId) {
        return i;
      }
    }
    return -1;
  },

  isOwner: function () {
    return this.conf.creator == cc.vv.userMgr.userId;
  },

  getSeatByID: function (userId) {
    var seatIndex = this.getSeatIndexByID(userId);
    var seat = this.seats[seatIndex];
    return seat;
  },

  getSelfData: function () {
    return this.seats[this.seatIndex];
  },

  getLocalIndex: function (index) {
    var numSeats = this.seats.length;
    var ret = (index - this.seatIndex + this.seats.length) % this.seats.length;

    if (numSeats == 3 && ret == 2) {
      return ret + 1;
    }

    if (numSeats == 2 && ret == 1) {
      return ret + 1;
    }
    return ret;
  },

  isJing: function (pai) {
    if (!this.jings) {
      return false;
    }
    return this.jings.indexOf(pai) != -1;
  },

  prepareReplay: function (roomInfo, detailOfGame, namemap) {
    this.roomId = roomInfo.id;
    this.seats = [];
    for (var i = 0; i < roomInfo.base_info.numPeople; ++i) {
      var s = {};
      this.seats[i] = s;
      s.userid = roomInfo['user_id' + i];
      s.seatindex = i;
      s.score = roomInfo['user_score' + i];
      s.name = namemap[s.userid];
    }
    this.turn = detailOfGame.base_info.button;
    this.gamestate = 'playing';
    var baseInfo = detailOfGame.base_info;
    this.jings = baseInfo.jings;
    if (!this.jings) {
      this.jings = [];
    }
    for (var i = 0; i < this.seats.length; ++i) {
      var s = this.seats[i];
      s.seatindex = i;
      s.score = null;
      s.holds = baseInfo.game_seats[i];
      // s.huaMap = baseInfo.game_huas[i];
      s.pengs = [];
      s.angangs = [];
      s.diangangs = [];
      s.wangangs = [];
      s.folds = [];
      console.log(s);
      if (cc.vv.userMgr.userId == s.userid) {
        this.seatIndex = i;
      }
    }
    // this.conf = {
    //     type:baseInfo.type,
    // }
    this.conf = roomInfo.base_info;
    if (this.conf.type == null) {
      this.conf.type == "xzdd";
    }
  },

  getWanfa: function (conf) {
    if (!conf) {
      conf = this.conf;
    }
    if (conf && conf.maxGames != null) {
      var strArr = [];
      strArr.push(conf.maxGames + "局");
      if (conf.maxFan != null) {
        strArr.push(conf.maxFan + "番封顶");
      }
      if (conf.aa) {
        strArr.push('AA支付');
      }

      if (conf.ipstrict) {
        strArr.push('防作弊');
      }

      //if(conf.numPeople){
      //    strArr.push('' + conf.numPeople + '人');
      //}

      if (conf.type == 'xzdd' || conf.type == 'xlch') {
        if (conf.hsz) {
          strArr.push("换三张");
        }
        if (conf.zimo == 1) {
          strArr.push("自摸加番");
        }
        else {
          strArr.push("自摸加底");
        }
        if (conf.jiangdui) {
          strArr.push("幺九将对");
        }
        if (conf.dianganghua == 1) {
          strArr.push("点杠花(自摸)");
        }
        else {
          strArr.push("点杠花(放炮)");
        }
        if (conf.menqing) {
          strArr.push("门清中张");
        }
        if (conf.tiandihu) {
          strArr.push("天地胡");
        }
      }
      else if (conf.type == 'hhmj') {
      }
      else if (conf.type == 'ftmj') {
        strArr.push('底分' + conf.baseScore * 10 + '分');
        if (conf.kepenggang) {
          strArr.push('可碰杠');
        }
        if (conf.daitijiao) {
          strArr.push('带踢脚');
        }
        if (conf.sanbuduan == 1) {
          strArr.push('三不断必飞');
        }
        else if (conf.sanbuduan == 2) {
          strArr.push('只飞听');
        }
        else {
          strArr.push('三不断可听');
        }
      }
      return strArr.join(" ");
    }
    return "";
  },

  initHandlers: function () {
    var self = this;
    setInterval(function () {
      self.update();
    }, 100);
    cc.vv.net.addHandler("login_result", function (data) {
      console.log(data);
      if (data.errcode === 0) {
        var data = data.data;
        self.roomId = data.roomid;
        self.conf = data.conf;
        self.maxNumOfGames = data.conf.maxGames;
        self.numOfGames = data.numofgames;
        self.seats = data.seats;
        self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
        self.isOver = false;
        cc.vv.userMgr.curSelectedType = cc.vv.gameNetMgr.conf.type;
      }
      else {
        console.log(data.errmsg);
      }
      self.dispatchEvent('login_result');
    });

    cc.vv.net.addHandler("login_finished", function (data) {
      console.log("login_finished");
      cc.game.loadScene("mjgame", function () {
        cc.vv.wc.hide();
        cc.vv.net.ping();
      });
      self.dispatchEvent("login_finished");
    });

    cc.vv.net.addHandler("exit_result", function (data) {
      self.roomId = null;
      self.turn = -1;
      self.dingque = -1;
      self.isDingQueing = false;
      self.seats = null;
      self.isOver = true;
    });

    cc.vv.net.addHandler("exit_notify_push", function (data) {
      var userId = data;
      var s = self.getSeatByID(userId);
      if (s != null) {
        s.userid = 0;
        s.name = "";
        self.dispatchEvent("user_state_changed", s);
      }
    });

    cc.vv.net.addHandler("dispress_push", function (data) {
      self.roomId = null;
      self.turn = -1;
      self.dingque = -1;
      self.isDingQueing = false;
      self.seats = null;
      self.isOver = true;
    });

    cc.vv.net.addHandler("disconnect", function (data) {
      self.dissoveData = null;
      if (self.roomId == null) {
        cc.vv.wc.show('正在返回游戏大厅');
        cc.game.loadScene("hall");
      }
      else {
        if (self.isOver == false) {
          cc.vv.userMgr.oldRoomId = self.roomId;
          self.dispatchEvent("disconnect");
        }
        else {
          self.roomId = null;
        }
      }
    });

    cc.vv.net.addHandler("new_user_comes_push", function (data) {
      //console.log(data);
      var seatIndex = data.seatindex;
      var needCheckIp = false;
      if (self.seats[seatIndex].userid > 0) {
        self.seats[seatIndex].online = true;
        if (self.seats[seatIndex].ip != data.ip) {
          self.seats[seatIndex].ip = data.ip;
          needCheckIp = true;
        }
      }
      else {
        data.online = true;
        self.seats[seatIndex] = data;
        needCheckIp = true;
      }
      self.dispatchEvent('new_user', self.seats[seatIndex]);

      if (needCheckIp) {
        self.dispatchEvent('check_ip', self.seats[seatIndex]);
      }
    });

    cc.vv.net.addHandler("user_state_push", function (data) {
      //console.log(data);
      var userId = data.userid;
      var seat = self.getSeatByID(userId);
      seat.online = data.online;
      self.dispatchEvent('user_state_changed', seat);
    });

    cc.vv.net.addHandler("game_tijiao_push", function (data) {
      self.tijiao = data;
    });


    cc.vv.net.addHandler("game_jings_push", function (data) {
      self.jings = data;
      self.dispatchEvent('game_jings_push');
    });

    cc.vv.net.addHandler("user_ready_push", function (data) {
      //console.log(data);
      var userId = data.userid;
      var seat = self.getSeatByID(userId);
      seat.ready = data.ready;
      self.dispatchEvent('user_state_changed', seat);
    });

    cc.vv.net.addHandler("game_holds_push", function (data) {
      var seat = self.seats[self.seatIndex];
      console.log(data);
      seat.holds = data;

      for (var i = 0; i < self.seats.length; ++i) {
        var s = self.seats[i];
        if (s.folds == null) {
          s.folds = [];
        }
        if (s.pengs == null) {
          s.pengs = [];
        }
        if (s.angangs == null) {
          s.angangs = [];
        }
        if (s.diangangs == null) {
          s.diangangs = [];
        }
        if (s.wangangs == null) {
          s.wangangs = [];
        }
        s.ready = false;
      }
      self.dispatchEvent('game_holds');
    });

    cc.vv.net.addHandler("game_begin_push", function (data) {
      console.log('game_action_push');
      console.log(data);
      self.button = data;
      self.turn = self.button;
      self.gamestate = "begin";
      self.dispatchEvent('game_begin');
    });

    cc.vv.net.addHandler("game_playing_push", function (data) {
      console.log('game_playing_push');
      self.gamestate = "playing";
      self.dispatchEvent('game_playing');
    });

    cc.vv.net.addHandler("game_sync_push", function (data) {
      console.log("game_sync_push");
      console.log(data);
      self.numOfMJ = data.numofmj;
      self.gamestate = data.state;
      self.tijiao = data.tijiao;
      if (self.gamestate == "dingque") {
        self.isDingQueing = true;
      }
      else if (self.gamestate == "huanpai") {
        self.isHuanSanZhang = true;
      }
      self.turn = data.turn;
      self.button = data.button;
      self.chupai = data.chuPai;
      self.jings = data.jings;
      self.lastChuPaiTurn = data.lastChuPaiTurn;
      self.huanpaimethod = data.huanpaimethod;
      for (var i = 0; i < self.seats.length; ++i) {
        var seat = self.seats[i];
        var sd = data.seats[i];
        seat.holds = sd.holds;
        seat.folds = sd.folds;
        seat.angangs = sd.angangs;
        seat.diangangs = sd.diangangs;
        seat.wangangs = sd.wangangs;
        seat.pengs = sd.pengs;
        seat.dingque = sd.que;
        seat.hued = sd.hued;
        seat.iszimo = sd.iszimo;
        seat.huinfo = sd.huinfo;
        seat.huanpais = sd.huanpais;
        seat.huaMap = sd.huamap;
        seat.isbaoting = sd.isbaoting;
        seat.isfeiting = sd.isfeiting;
        if (i == self.seatIndex) {
          self.dingque = sd.que;
        }
      }
      self.dispatchEvent('game_sync');
    });

    cc.vv.net.addHandler("game_dingque_push", function (data) {
      self.isDingQueing = true;
      self.isHuanSanZhang = false;
      self.gamestate = 'dingque';
      self.dispatchEvent('game_dingque');
    });

    cc.vv.net.addHandler("game_huanpai_push", function (data) {
      self.isHuanSanZhang = true;
      self.dispatchEvent('game_huanpai');
    });

    cc.vv.net.addHandler("hangang_notify_push", function (data) {
      self.dispatchEvent('hangang_notify', data);
    });

    cc.vv.net.addHandler("game_action_push", function (data) {
      self.curaction = data;
      console.log(data);
      self.dispatchEvent('game_action', data);
    });

    cc.vv.net.addHandler("game_chupai_push", function (data) {
      console.log('game_chupai_push');
      cc.vv.gameNetMgr.gamestart = false;
      //console.log(data);
      var turnUserID = data;
      var si = self.getSeatIndexByID(turnUserID);
      self.doTurnChange(si);
    });

    cc.vv.net.addHandler("game_num_push", function (data) {
      self.numOfGames = data;
      self.dispatchEvent('game_num', data);
    });

    cc.vv.net.addHandler("game_over_push", function (data) {
      console.log('game_over_push');
      var results = data.results;
      for (var i = 0; i < self.seats.length; ++i) {
        self.seats[i].score = results.length == 0 ? 0 : results[i].totalscore;
      }
      self.dispatchEvent('game_over', results);
      if (data.endinfo) {
        self.isOver = true;
        self.dispatchEvent('game_end', data.endinfo);
      }
      self.reset();
      for (var i = 0; i < self.seats.length; ++i) {
        self.dispatchEvent('user_state_changed', self.seats[i]);
      }
    });

    cc.vv.net.addHandler("game_buhua_push", function (data) {
      console.log('game_buhua_push');
      var si = data.si;
      var seat = self.seats[si];
      seat.huaMap = data.huamap;
      self.dispatchEvent('game_buhua', seat);
    });

    cc.vv.net.addHandler("game_newhua_push", function (data) {
      console.log('game_newhua_push');
      self.doBuHua(data);
    });

    cc.vv.net.addHandler("mj_count_push", function (data) {
      console.log('mj_count_push');
      self.numOfMJ = data;
      //console.log(data);
      self.dispatchEvent('mj_count', data);
    });

    cc.vv.net.addHandler("hu_push", function (data) {
      console.log('hu_push');
      console.log(data);
      self.doHu(data);
      self.lastChuPaiTurn = -1;
    });

    cc.vv.net.addHandler("game_chupai_notify_push", function (data) {
      cc.vv.gameNetMgr.gamestart = false;
      var userId = data.userId;
      var pai = data.pai;
      var si = self.getSeatIndexByID(userId);
      self.doChupai(si, pai);
    });

    cc.vv.net.addHandler("game_mopai_push", function (data) {
      console.log('game_mopai_push');
      self.doMopai(self.seatIndex, data);
    });

    cc.vv.net.addHandler("guo_notify_push", function (data) {
      console.log('guo_notify_push');
      var userId = data.userId;
      var pai = data.pai;
      var si = self.getSeatIndexByID(userId);
      self.doGuo(si, pai);
    });

    cc.vv.net.addHandler("guo_result", function (data) {
      console.log('guo_result');
      self.dispatchEvent('guo_result');
    });

    cc.vv.net.addHandler("guohu_push", function (data) {
      console.log('guohu_push');
      self.dispatchEvent("push_notice", { info: "过胡", time: 1.5 });
    });

    cc.vv.net.addHandler("huanpai_notify", function (data) {
      var seat = self.getSeatByID(data.si);
      seat.huanpais = data.huanpais;
      self.dispatchEvent('huanpai_notify', seat);
    });

    cc.vv.net.addHandler("game_huanpai_over_push", function (data) {
      console.log('game_huanpai_over_push');
      var info = "";
      var method = data.method;
      if (method == 0) {
        info = "换对家牌";
      }
      else if (method == 1) {
        info = "换下家牌";
      }
      else {
        info = "换上家牌";
      }
      self.huanpaimethod = method;
      cc.vv.gameNetMgr.isHuanSanZhang = false;
      self.dispatchEvent("game_huanpai_over");
      self.dispatchEvent("push_notice", { info: info, time: 2 });
    });

    cc.vv.net.addHandler("peng_notify_push", function (data) {
      console.log('peng_notify_push');
      console.log(data);
      var userId = data.userid;
      var pai = data.pai;
      var si = self.getSeatIndexByID(userId);
      self.lastChuPaiTurn = -1;
      self.doPeng(si, data.pai);
    });

    cc.vv.net.addHandler("gang_notify_push", function (data) {
      console.log('gang_notify_push');
      console.log(data);
      var userId = data.userid;
      var pai = data.pai;
      var si = self.getSeatIndexByID(userId);
      self.lastChuPaiTurn = -1;
      self.doGang(si, pai, data.gangtype);
    });

    cc.vv.net.addHandler("game_dingque_notify_push", function (data) {
      self.dispatchEvent('game_dingque_notify', data);
    });

    cc.vv.net.addHandler("game_dingque_finish_push", function (data) {
      for (var i = 0; i < data.length; ++i) {
        self.seats[i].dingque = data[i];
        if (i == self.seatIndex) {
          self.dingque = data[i];
        }
      }
      self.dispatchEvent('game_dingque_finish', data);
    });


    cc.vv.net.addHandler("chat_push", function (data) {
      self.dispatchEvent("chat_push", data);
    });

    cc.vv.net.addHandler("quick_chat_push", function (data) {
      self.dispatchEvent("quick_chat_push", data);
    });

    cc.vv.net.addHandler("emoji_push", function (data) {
      self.dispatchEvent("emoji_push", data);
    });
    cc.vv.net.addHandler("interactive_emoji_push", function (data) {
      self.dispatchEvent("interactive_emoji_push", data);
    });

    cc.vv.net.addHandler("dissolve_notice_push", function (data) {
      console.log("dissolve_notice_push");
      console.log(data);
      self.dissoveData = data;
      self.dispatchEvent("dissolve_notice", data);
    });

    cc.vv.net.addHandler("dissolve_cancel_push", function (data) {
      self.dissoveData = null;
      self.dispatchEvent("dissolve_cancel", data);
    });

    cc.vv.net.addHandler("voice_msg_push", function (data) {
      self.dispatchEvent("voice_msg", data);
    });

    cc.vv.net.addHandler("game_baoting_notify_push", function (data) {
      console.log('game_baoting_notify_push');
      var userId = data.userId;
      var si = self.getSeatIndexByID(userId);
      self.seats[si].isbaoting = true;
      self.seats[si].isfeiting = data.isfeiting;
      self.dispatchEvent('game_baoting_notify', si);
    });

    cc.vv.net.addHandler("game_pre_baoting_push", function (data) {
      console.log('game_pre_baoting_push');
      self.gamestate = 'baoting';
      self.dispatchEvent('game_pre_baoting');
    });
  },

  doGuo: function (seatIndex, pai) {
    var seatData = this.seats[seatIndex];
    var folds = seatData.folds;
    //folds.push(pai);
    this.dispatchEvent('guo_notify', seatData);
  },

  doMopai: function (seatIndex, pai) {
    var seatData = this.seats[seatIndex];
    if (seatData.holds) {
      seatData.holds.push(pai);
      this.dispatchEvent('game_mopai', { seatIndex: seatIndex, pai: pai });
    }
  },

  doChupai: function (seatIndex, pai) {
    this.chupai = pai;


    var seatData = this.seats[seatIndex];
    //还原
    if (this.seats != null && this.tempchupai != null && this.seatIndex == seatIndex) {//判断临时出牌，对不对，
      var foldslength = seatData.folds.length;
      if (foldslength != 0 && seatData.folds[foldslength - 1] != pai) {//还原
        if (seatData.holds) {    //去除手中的牌         
          var idx = seatData.holds.indexOf(pai);
          seatData.holds.splice(idx, 1);
          seatData.holds.push(this.tempchupai);
        }
        seatData.folds[foldslength - 1] = pai;
      }
      this.tempchupai = null;
      return;
    }
    //还原
    if (seatData.holds) {
      var idx = seatData.holds.indexOf(pai);
      seatData.holds.splice(idx, 1);
    }
    this.removemyfolds = false;
    seatData.folds.push(pai);//8.10
    this.dispatchEvent('game_chupai_notify', { seatData: seatData, pai: pai });
  },

  doTempChupai: function (pai) {
    this.chupai = pai;
    this.tempchupai = pai;//记录临时出牌
    var seatIndex = this.seatIndex;


    var seatData = this.seats[seatIndex];
    if (seatData.holds) {    //去除手中的牌         
      var idx = seatData.holds.indexOf(pai);
      seatData.holds.splice(idx, 1);
    }
    this.removemyfolds = false;
    seatData.folds.push(pai);//8.10
    this.dispatchEvent('game_chupai_notify', { seatData: seatData, pai: pai });
  },

  doBuHua: function (data) {
    var si = data.si;
    var seat = this.seats[si];
    if (seat.huaMap == null) {
      seat.huaMap = {};
    }
    if (seat.huaMap[data.pai]) {
      seat.huaMap[data.pai]++;
    }
    else {
      seat.huaMap[data.pai] = 1;
    }
    this.dispatchEvent('game_newhua', seat);
  },

  doPeng: function (seatIndex, pai) {
    var seatData = this.seats[seatIndex];
    //移除手牌
    if (seatData.holds) {
      for (var i = 0; i < 2; ++i) {
        var idx = seatData.holds.indexOf(pai);
        seatData.holds.splice(idx, 1);
      }
    }
    //移除打出的牌
    this.seats[this.turn].folds.pop();

    //更新碰牌数据
    var pengs = seatData.pengs;
    pengs.push(pai);

    this.dispatchEvent('peng_notify', seatData);
  },

  getGangType: function (seatData, pai) {
    if (seatData.pengs.indexOf(pai) != -1) {
      return "wangang";
    }
    else {
      var cnt = 0;
      for (var i = 0; i < seatData.holds.length; ++i) {
        if (seatData.holds[i] == pai) {
          cnt++;
        }
      }
      if (cnt == 3) {
        return "diangang";
      }
      else {
        return "angang";
      }
    }
  },

  doGang: function (seatIndex, pai, gangtype) {
    var seatData = this.seats[seatIndex];

    if (!gangtype) {
      gangtype = this.getGangType(seatData, pai);
    }

    if (gangtype == "wangang") {
      if (seatData.pengs.indexOf(pai) != -1) {
        var idx = seatData.pengs.indexOf(pai);
        if (idx != -1) {
          seatData.pengs.splice(idx, 1);
        }
      }
      seatData.wangangs.push(pai);
    }
    if (seatData.holds) {
      for (var i = 0; i <= 4; ++i) {
        var idx = seatData.holds.indexOf(pai);
        if (idx == -1) {
          //如果没有找到，表示移完了，直接跳出循环
          break;
        }
        seatData.holds.splice(idx, 1);
      }
    }
    if (gangtype == "angang") {
      seatData.angangs.push(pai);
    }
    else if (gangtype == "diangang") {
      seatData.diangangs.push(pai);
      this.seats[this.turn].folds.pop();
    }
    this.dispatchEvent('gang_notify', { seatData: seatData, gangtype: gangtype });
  },

  doHu: function (data) {
    if (!data.zimo) {
      if (!this.removemyfolds) {
        this.seats[this.turn].folds.pop();
        this.removemyfolds = true;
      }

    }

    this.dispatchEvent('hupai', data);
  },

  doTurnChange: function (si) {
    var data = {
      last: this.turn,
      turn: si,
    }
    this.turn = si;
    this.dispatchEvent('game_chupai', data);
  },

  connectGameServer: function (data) {
    this.dissoveData = null;
    cc.vv.net.ip = data.ip + ":" + data.port;
    console.log(cc.vv.net.ip);
    var self = this;

    var onConnectOK = function () {
      console.log("onConnectOK");
      var sd = {
        token: data.token,
        roomid: data.roomid,
        time: data.time,
        sign: data.sign,
      };
      cc.vv.net.send("login", sd);
    };

    var onConnectFailed = function () {
      console.log("failed.");
      cc.vv.wc.hide();
    };
    cc.vv.wc.show("正在进入房间");
    cc.vv.net.connect(onConnectOK, onConnectFailed);
  },

  testServerOn: function () {
    console.log('testServerOn');
    cc.vv.net.test(function (ret) {
      if (ret) {
        cc.vv.gameNetMgr.reset();
        //cc.game.loadScene('hall');
        var roomId = cc.vv.userMgr.oldRoomId;
        if (roomId != null) {
          cc.vv.userMgr.oldRoomId = null;
          cc.vv.userMgr.enterRoom(roomId, function (ret) {
            if (ret.errcode != 0) {
              cc.vv.gameNetMgr.roomId = null;
              cc.game.loadScene('hall');
            }
          });
        }
      }
      else {
        setTimeout(this.testServerOn.bind(this), 3000);
      }
    }.bind(this));
  },

  isGamePlaying: function () {
    var isGamePlaying = cc.vv.gameNetMgr.roomId && !cc.vv.gameNetMgr.isOver && (cc.vv.replayMgr && !cc.vv.replayMgr.isReplay());
    return isGamePlaying;
  },
  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    var isGamePlaying = this.isGamePlaying();
    var isNetTurnOff = this.lastSio && !cc.vv.net.sio;
    if (isGamePlaying && isNetTurnOff) {
      this.testServerOn();
    }
    this.lastSio = cc.vv.net.sio;
  }

}
