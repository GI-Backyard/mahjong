// let cc = window.cc;
let { color4 } = cc.math;
export default class SeatComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._zhuangImage = null;
    this._offlineImage = null;
    this._queImage = null;
    // this._lblName = null;
    // this._lblScore = null;
    // this._scoreBg = null;
    // this._nddayingjia = null;
    // this._voicemsg = null;

    // this._chatBubble = null;
    // this._emoji = null;
    // this._lastChatTime = -1;

    this._userName = "";
    this._score = 0;
    this._dayingjia = false;
    this._isOffline = false;
    this._isReady = false;
    this._isZhuang = false;
    this._userId = null;
    this._queSprites = {};
    this._que = null;
  }

  start() {
    if (cc.vv == null) {
      return;
    }

    let seatNode = this._entity;
    let app = this._app;
    let en = app.find('zhuang', seatNode);
    let comp = en && en.getComp('Image');
    this._zhuangImage = comp;

    en = app.find('offline', seatNode);
    comp = en && en.getComp('Image');
    this._offlineImage = comp;

    en = app.find('que', seatNode);
    comp = en && en.getComp('Image');
    this._queImage = comp;

    // get tong, tiao, wan sprites
    let seats = seatNode.parent;
    let dummy = app.find('dummy', seats);
    en = app.find('wan', dummy);
    comp = en && en.getComp('Image');
    this._queSprites['wan'] = comp.sprite;

    en = app.find('tong', dummy);
    comp = en && en.getComp('Image');
    this._queSprites['tong'] = comp.sprite;

    en = app.find('tiao', dummy);
    comp = en && en.getComp('Image');
    this._queSprites['tiao'] = comp.sprite;
    // this._sprIcon = this.node.getChildByName('iconmask').getChildByName("icon").getComponent("ImageLoader");
    // this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
    // this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
    // this._voicemsg = this.node.getChildByName("voicemsg");
    // this._xuanpai = this.node.getChildByName("xuanpai");
    // this.refreshXuanPaiState();

    // if (this._voicemsg) {
    //   this._voicemsg.active = false;
    // }

    // if (this._sprIcon && this._sprIcon.getComponent(cc.Button)) {
    //   cc.vv.utils.addClickEvent(this._sprIcon, this.node, "Seat", "onIconClicked");
    // }


    // this._offline = this.node.getChildByName("offline");

    // this._ready = this.node.getChildByName("ready");

    // this._zhuang = this.node.getChildByName("zhuang");

    // this._ting = this.node.getChildByName("ting");

    // this._scoreBg = this.node.getChildByName("Z_money_frame");
    // this._nddayingjia = this.node.getChildByName("dayingjia");

    // this._chatBubble = this.node.getChildByName("ChatBubble");
    // if (this._chatBubble != null) {
    //   this._chatBubble.active = false;
    // }

    // this._emoji = this.node.getChildByName("emoji");
    // if (this._emoji != null) {
    //   this._emoji.active = false;
    // }

    this.refresh();

    // if (this._sprIcon && this._userId) {
    //   this._sprIcon.setUserID(this._userId);
    // }
  }

  onIconClicked() {
    // var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
    // if (this._userId != null && this._userId > 0) {
    //   var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
    //   var sex = 0;
    //   if (cc.vv.baseInfoMap) {
    //     var info = cc.vv.baseInfoMap[this._userId];
    //     if (info) {
    //       sex = info.sex;
    //     }
    //   }
    //   cc.vv.userinfoGameShow.show(seat.name, seat.userid, iconSprite, sex, seat.ip);
    //   //cc.vv.userinfoShow.show(seat.name,seat.userid,iconSprite,sex,seat.ip);         
    // }
  }

  refresh() {
    if (this._zhuangImage) {
      this._zhuangImage.enabled = this._isZhuang;
    }
    if (this._queImage) {
      this._queImage.enabled = (this._que !== null);
      this._queImage.sprite = this._queSprites[this._que || 'wan'];
    }
    if (this._offlineImage) {
      this._offlineImage.enabled = this._isOffline;
    }
  }

  setInfo(name, score, dayingjia) {
    this._userName = name;
    this._score = score;
    if (this._score === null) {
      this._score = 0;
    }
    this._dayingjia = dayingjia;

    // if (this._scoreBg != null) {
    //   this._scoreBg.active = this._score != null;
    // }

    // if (this._lblScore != null) {
    //   this._lblScore.node.active = this._score != null;
    // }

    this.refresh();
  }

  setZhuang(value) {
    value = !!value;
    this._isZhuang = value;
    if (this._zhuangImage) {
      this._zhuangImage.enabled = !!value;
    }
  }

  setQue(que) {
    this._que = que;
    if (this._queImage) {
      this._queImage.enabled = (que !== null);
      this._queImage.sprite = this._queSprites[que || 'wan'];
    }

    console.log(`user selected que ${que || 'null'}`);
  }

  setReady(isReady) {
    this._isReady = isReady;
    // if (this._ready) {
    //   this._ready.active = this._isReady && (cc.vv.gameNetMgr.numOfGames > 0);
    // }
  }

  setID(id, pre) {
    if (!pre) {
      pre = '';
    }
    if (id === 0) {
      this._entity.enabled = false;
      // console.warn(' assign an empty player');
    } else {
      this._entity.enabled = true;
    }
    // var idNode = this.node.getChildByName("id");
    // if (idNode) {
    //   var lbl = idNode.getComponent(cc.Label);
    //   lbl.string = pre + id;
    // }

    this._userId = id;
    // if (this._sprIcon) {
    //   this._sprIcon.setUserID(id);
    // }
  }

  setOffline(isOffline) {
    isOffline = !!isOffline;
    this._isOffline = isOffline;
    if (this._offlineImage) {
      this._offlineImage.enabled = isOffline;
    }
    // this._isOffline = isOffline;
    // // set XXX
    // let image = this._entity.getComp('Image');
    // if (isOffline) {
    //   image && (image.color = color4.new(0.2, 0.2, 0.2, 1.0));
    // } else {
    //   image && (image.colors = color4.new(1.0, 1.0, 1.0, 1.0));
    // }
    // // hack code
    // image._vertexDataDirty = true;
    // if (this._offline) {
    //   this._offline.active = this._isOffline && this._userName != "";
    // }
  }

  baoTing(isBaoTing, isFeiTing) {
    this._isBaoTing = isBaoTing;
    this._isFeiTing = isFeiTing;
    // if (this._ting) {
    //   this._ting.active = this._isBaoTing;
    //   if (this._isBaoTing) {

    //     if (!this._isFeiTing) {
    //       this._ting.getChildByName("tp").active = true;
    //       this._ting.getChildByName("ft").active = false;
    //     }
    //     else {
    //       this._ting.getChildByName("tp").active = false;
    //       this._ting.getChildByName("ft").active = true;;
    //     }



    //   }
    // }
  }

  chat(content) {
    console.log(content);
    // if (this._chatBubble == null || this._emoji == null) {
    //   return;
    // }
    // this._emoji.active = false;
    // this._chatBubble.active = true;
    // //this._chatBubble.getComponent(cc.Label).string = content;
    // this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
    this._lastChatTime = 3;
  }

  emoji(emoji) {
    //emoji = JSON.parse(emoji);
    // if (this._emoji == null || this._emoji == null) {
    //   return;
    // }
    console.log(emoji);
    // this._chatBubble.active = false;
    // this._emoji.active = true;

    // emoji = JSON.parse(emoji);
    // this._emoji.getComponent(cc.Sprite).spriteFrame = cc.vv.spriteFrame[emoji.name];

    // this._emoji.getComponent(cc.Animation).play('emoji_ani_' + emoji.num);
    this._lastChatTime = 4;
  }

  voiceMsg(show) {
    // if (this._voicemsg) {
    //   this._voicemsg.active = show;
    // }
  }

  refreshXuanPaiState() {
    // if (this._xuanpai == null) {
    //   return;
    // }

    // this._xuanpai.active = cc.vv.gameNetMgr.isHuanSanZhang;
    // if (cc.vv.gameNetMgr.isHuanSanZhang == false) {
    //   return;
    // }

    // this._xuanpai.getChildByName("xz").active = false;
    // this._xuanpai.getChildByName("xd").active = false;

    // var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
    // if (seat) {
    //   if (seat.huanpais == null) {
    //     this._xuanpai.getChildByName("xz").active = true;
    //   }
    //   else {
    //     this._xuanpai.getChildByName("xd").active = true;
    //   }
    // }
  }

  // called every frame, uncomment this function to activate update callback
  tick(dt) {
    if (this._lastChatTime > 0) {
      this._lastChatTime -= dt;
      if (this._lastChatTime < 0) {
        // this._chatBubble.active = false;
        // this._emoji.active = false;
        // this._emoji.getComponent(cc.Animation).stop();
      }
    }
  }
}