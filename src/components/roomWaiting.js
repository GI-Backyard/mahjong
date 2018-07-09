// let cc = window.cc;
let { color4 } = cc.math;
export default class RoomWaiting extends cc.ScriptComponent {
  constructor() {
    super();
    // this._waitingSeats = [];
    this._mjSeats = [];
  }

  start() {
    this.initView();
    let node = this._mjGameNode;
    this._registerCallback(node, 'new_user', (data) => {
      this.initSingleSeat(data);
    });

    this._registerCallback(node, 'user_state_changed', (data) => {
      this.initSingleSeat(data);
    });
    this._registerCallback(node, 'game_begin', () => {
      // this.refreshBtns();
      this.initSeats();
    });
    this._registerCallback(node, 'game_num', () => {
      // this.refreshBtns();
    });
    this._registerCallback(node, 'game_huanpai', () => {
      // for (let i in this._mjSeats) {
      //   this._mjSeats[i].refreshXuanPaiState();
      // }
    });
    this._registerCallback(node, 'game_dingque_finish', () => {
      this.refreshQueState();
    });
    this._registerCallback(node, 'huanpai_notify', (data) => {
      let idx = data.detail.seatindex;
      let localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
      // this._mjSeats[localIdx].refreshXuanPaiState();
    });
    this._registerCallback(node, 'game_huanpai_over', () => {
      // for (let i in this._mjSeats) {
      //   this._mjSeats[i].refreshXuanPaiState();
      // }
    });
    this._registerCallback(node, 'voice_msg', () => {
      console.warn('voice_msg is not implemented.');
    });
    this._registerCallback(node, 'chat_push', () => {
      console.warn('chat_push is not implemented.');
    });
    this._registerCallback(node, 'quick_chat_push', () => {
      console.warn('quick_chat_push is not implemented.');
    });
    this._registerCallback(node, 'emoji_push', () => {
      console.warn('emoji_push is not implemented.');
    });
    this._registerCallback(node, 'interactive_emoji_push', () => {
      console.warn('interactive_emoji_push is not implemented.');
    });
    this._registerCallback(node, 'game_baoting_notify', (data) => {
      data = data.detail;
      let idx = data;
      let localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
      let seatData = cc.vv.gameNetMgr.seats[idx];
      // this._mjSeats[localIdx].baoTing(true, seatData.isfeiting);
    });
    this.initSeats();
    console.log('root waiting runs');
  }

  _registerCallback(node, event, callback) {
    if (callback) {
      node.on(event, callback);
    } else {
      node.on(event, () => {
        console.error(`event listener is not implemented.`);
      })
    }
  }

  initView() {
    let app = this._app;
    let seatsIndices = ['me', 'right', 'top', 'left'];
    // let waitingSeats = app.find(this.waitingSeats);
    let gameSeats = this.mjGameSeats;
    if (!gameSeats.active) {
      gameSeats.active = true;
    }

    for (let index = 0; index < 4; ++index) {
      // let en = app.find(seatsIndices[index], waitingSeats);
      // this._waitingSeats.push(en && en.getComp('game.seat'));
      let en = app.find(seatsIndices[index], gameSeats);
      this._mjSeats.push(en && en.getComp('game.seat'));
    }

    this._initWanfaLabel();
  }

  refreshQueState() {
    let arr = ["tong", "tiao", "wan"];
    let data = cc.vv.gameNetMgr.seats;
    for (let i = 0; i < data.length; ++i) {
      let que = data[i].dingque;
      if (que == null || que < 0 || que >= arr.length) {
        que = null;
        // this._mjSeats.active = false;
      }
      else {
        que = arr[que];
        // this._mjSeats.active = true;
      }

      let localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
      this._mjSeats[localIndex].setQue(que);

    }
  }

  initSeats() {
    let seats = cc.vv.gameNetMgr.seats;
    for (let i = 0; i < seats.length; ++i) {
      this.initSingleSeat(seats[i]);
    }
    this.refreshQueState();
  }

  initSingleSeat(seat) {
    let index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
    let isOffline = !seat.online;
    let isZhuang = (seat.seatindex == cc.vv.gameNetMgr.button);
    // let seatNode = this._waitingSeats[index];
    // if (seat.userid !== 0) {
    //   seatNode.active = true;
    //   let image = seatNode.getComp('Image');
    //   if (isOffline) {
    //     image.color = color4.new(0.2, 0.2, 0.2, 1.0);
    //   } else {
    //     image.color = color4.new(1.0, 1.0, 1.0, 1.0);
    //   }
    // } else {
    //   seatNode.active = false;
    // }
    // console.log("isOffline:" + isOffline);

    // this._waitingSeats[index].setInfo(seat.name, seat.score);
    // this._waitingSeats[index].setReady(seat.ready);
    // this._waitingSeats[index].setOffline(isOffline);
    // this._waitingSeats[index].setID(seat.userid, 'ID:');
    // this._waitingSeats[index].voiceMsg(false);

    this._mjSeats[index].setInfo(seat.name, seat.score);
    this._mjSeats[index].setZhuang(isZhuang);
    this._mjSeats[index].setOffline(isOffline);
    this._mjSeats[index].setID(seat.userid, 'ID:');
    // this._mjSeats[index].voiceMsg(false);
    // this._mjSeats[index].baoTing(seat.isbaoting, seat.isfeiting);
    this._mjSeats[index].refreshXuanPaiState();
  }

  _onPlayerOver() {
    // nothing to do here now, maybe add voice control
  }

  _onDestroy() {
    // nothing to do here now, maybe add voice control
  }

  tick() {
    let dt = this._app.deltaTime;
    // todo, tick time label show
  }

  _playVoice() {
    console.error('room:_playVoice not implemented');
  }

  _onBtnExit() {
    console.error('room:_onBtnExit not implemented');
  }

  _onBtnDissolveClicked() {
    console.error('room:_onBtnDissolveClicked not implemented');
  }

  _onBtnChatClicked() {
    // nothing to do here now
  }

  _onBtnBackClicked() {
    console.error('room:_onBtnBackClicked not implemented');
  }

  _onBtnSettingsClicked() {
    console.error('room:_onBtnSettingsClicked not implemented');
  }

  _initWanfaLabel() {
    let typeStr = '';
    if (cc.vv.gameNetMgr.conf) {
      let type = cc.vv.gameNetMgr.conf.type;
      if (type == 'xzdd') {
        typeStr = '血战到底';
      }
      else if (type == 'xlch') {
        typeStr = '血流成河';
      }
    }

    console.log(' 房号:' + cc.vv.gameNetMgr.roomId);
    console.log(cc.vv.gameNetMgr.getWanfa());
    // let wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
    // var roomid = cc.find("Canvas/infobar/roomid").getComponent(cc.Label);
    // roomid.string = ' 房号:' + cc.vv.gameNetMgr.roomId;
    // wanfa.string = cc.vv.gameNetMgr.getWanfa();
  }
}

RoomWaiting.schema = {
  mjGameNode: {
    type: 'entity',
    default: null,
  },

  mjGameSeats: {
    type: 'entity',
    default: null,
  },
}