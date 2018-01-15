// let cc = window.cc;

export default {
  account: null,
  userId: null,
  userName: null,
  lv: 0,
  exp: 0,
  coins: 0,
  gems: 0,
  sign: 0,
  ip: "",
  sex: 0,
  roomData: null,
  oldRoomId: null,
  curSelectedType: "hhmj",

  guestAuth: function () {
    let account = cc.args["account"];
    if (account == null) {
      account = cc.sys.localStorage.getItem("account");
    }

    if (account == null) {
      account = Date.now();
      cc.sys.localStorage.setItem("account", account);
    }

    cc.vv.http.sendRequest("/guest", { account: account }, this.onAuth);
  },

  onAuth: function (ret) {
    let self = cc.vv.userMgr;
    if (ret.errcode !== 0) {
      console.log(ret.errmsg);
    }
    else {
      self.account = ret.account;
      self.sign = ret.sign;
      cc.vv.http.url = "http://" + cc.vv.SI.hall;
      self.login();
    }
  },

  login: function () {
    let self = this;
    let onLogin = function (ret) {
      if (!ret || ret.errcode !== 0) {
        //console.log(ret.errmsg);
        cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
      }
      else {
        if (!ret.userid) {
          if (self.account.indexOf('wx_') == 0) {
            cc.vv.wc.hide();
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            cc.vv.http.url = cc.vv.http.master_url;
            return;
          }

          cc.game.loadScene("createrole");
        }
        else {
          console.log(ret);
          self.account = ret.account;
          self.userId = ret.userid;
          self.userName = ret.name;
          self.lv = ret.lv;
          self.exp = ret.exp;
          self.coins = ret.coins;
          self.gems = ret.gems;
          self.roomData = ret.roomid;
          self.sex = ret.sex;
          self.ip = ret.ip;
          self.invitor = ret.invitor,
            self.maxShareAwards = ret.max_share_awards;
          self.dealerState = ret.dealer_state;
          cc.game.loadScene("hall");
        }
      }
    }.bind(this);
    cc.vv.wc.show("正在登录游戏");
    cc.vv.http.sendRequest("/login", { account: this.account, sign: this.sign }, onLogin);
  },

  create: function (name) {
    var self = this;
    var onCreate = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
      }
      else {
        self.login();
      }
    };

    var data = {
      account: this.account,
      sign: this.sign,
      name: name
    };
    cc.vv.http.sendRequest("/create_user", data, onCreate);
  },

  enterRoom: function (roomId, callback) {
    var self = this;
    var onEnter = function (ret) {
      if (ret.errcode !== 0) {
        if (ret.errcode == -1 || ret.errcode <= -10000) {
          setTimeout(function () {
            self.enterRoom(roomId, callback);
          }, 5000);
        }
        else {
          cc.vv.wc.hide();
          if (callback != null) {
            callback(ret);
          }
        }
      }
      else {
        cc.vv.wc.hide();
        if (callback != null) {
          callback(ret);
        }
        cc.vv.gameNetMgr.connectGameServer(ret);
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      roomid: roomId
    };
    cc.vv.wc.show("正在进入房间 " + roomId);
    cc.vv.http.sendRequest("/enter_private_room", data, onEnter);
  },

  getHistoryList: function (callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
      }
      else {
        if (callback != null) {
          callback(ret);
        }
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
    };
    cc.vv.http.sendRequest("/get_history_list", data, onGet);
  },

  getGamesOfRoom: function (uuid, callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
      }
      else {
        console.log(ret.data);
        callback(ret.data);
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      uuid: uuid,
    };
    cc.vv.http.sendRequest("/get_games_of_room", data, onGet);
  },

  getDetailOfGame: function (uuid, index, callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
      }
      else {
        console.log(ret.data);
        callback(ret.data);
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      uuid: uuid,
      index: index,
    };
    cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
  },

  getBillList: function (callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
      }
      else {
        console.log(ret.bills);
        if (callback != null) {
          callback(ret.bills);
        }
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
    };
    cc.vv.http.sendRequest("/get_bill_list", data, onGet);
  },

  getShopData: function (shopId, callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
        if (callback != null) {
          callback(null);
        }
      }
      else {
        if (callback != null) {
          callback(ret.data);
        }
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      shopid: shopId,
    };
    cc.vv.http.sendRequest("/get_shop_data", data, onGet);
  },

  getBillboardData: function (type, callback) {
    var self = this;
    var onGet = function (ret) {
      if (ret.errcode !== 0) {
        console.log(ret.errmsg);
        if (callback != null) {
          callback(null);
        }
      }
      else {
        if (callback != null) {
          callback(ret.data);
        }
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      type: type,
    };
    cc.vv.http.sendRequest("/get_billboard_data", data, onGet);
  },

  bindInvitor: function (invitorId, callback) {
    var self = this;
    var onGet = function (ret) {
      cc.vv.wc.hide();
      if (callback != null) {
        callback(ret);
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      invitor: invitorId,
    };
    cc.vv.wc.show('正在与服务器通信');
    cc.vv.http.sendRequest("/bind_invitor", data, onGet);
  },

  requestDealer: function (reqData, callback) {
    var self = this;
    var onGet = function (ret) {
      cc.vv.wc.hide();
      if (callback != null) {
        callback(ret);
      }
    };

    var data = {
      account: cc.vv.userMgr.account,
      sign: cc.vv.userMgr.sign,
      data: JSON.stringify(reqData),
    };
    cc.vv.wc.show('正在与服务器通信');
    cc.vv.http.sendRequest("/request_dealer", data, onGet);
  },

}
