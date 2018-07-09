// let cc = window.cc;
let { quat } = cc.math;
export default class TurnPointerComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._defaultTurn = null;
    this._turnS = [];
    this._lastActiveTurn = null;
  }

  start() {
    let app = this._app;
    this._defaultTurn = app.find('kong', this._turnPointer);
    let turnstring = ['dong', 'nan', 'xi', 'bei'];
    this._turnS.push(app.find(turnstring[0], this._turnPointer));
    this._turnS.push(app.find(turnstring[1], this._turnPointer));
    this._turnS.push(app.find(turnstring[2], this._turnPointer));
    this._turnS.push(app.find(turnstring[3], this._turnPointer));
    let node = this._entity;
    node.on('game_begin', (data) => {
      this.initRound();
      this.initPointer();
    });

    node.on('game_chupai', (data) => {
      this.initPointer();
      // self._time = 10;
      // self._alertTime = 3;
    });
    this.initRound();
    this._lastActiveTurn = this._defaultTurn;
    this._defaultTurn.active = true;
    this.initPointer();
  }

  initRound() {
    let index = cc.vv.gameNetMgr.getLocalIndex(0);
    cc.math.quat.fromEuler(this._turnPointer.lrot, 0, index * 90, 0);
    console.log('new round start');
  }

  getPointerIndex(index) {
    var numSeats = cc.vv.gameNetMgr.seats.length;
    var ret = index;

    if (numSeats == 3 && ret == 2) {
      return ret - 1;
    }

    if (numSeats == 2 && ret == 1) {
      return ret - 1;
    }
    return ret;
  }

  initPointer() {
    if (cc.vv == null) {
      return;
    }
    // this._arrow.active = cc.vv.gameNetMgr.gamestate == "playing";
    // if (!this._arrow.active) {
    //   return;
    // }

    // var buttonLocalIndex = cc.vv.gameNetMgr.getLocalIndex(0);
    // this._pointer.rotation = buttonLocalIndex * -90;

    // let index = cc.vv.gameNetMgr.getLocalIndex();
    // // cc.math.quat.fromEuler(this._turnPointer.lrot, 0, index * 90, 0);
    // for (var i = 0; i < this._pointer.children.length; ++i) {
    //   this._pointer.children[i].active = (i == index);
    // }
    if (cc.vv.gameNetMgr.turn !== -1) {
      this.selectPointer((this._turnS.length - cc.vv.gameNetMgr.turn)%this._turnS.length) ;
    } else {
      this.selectPointer(-1);
    }
  }

  selectPointer(index) {
    this._lastActiveTurn.active = false;
    if (index === -1) {
      this._defaultTurn.active = true;
      this._lastActiveTurn = this._defaultTurn;
    } else {
      this._turnS[index].active = true;
      this._lastActiveTurn = this._turnS[index];
    }
  }
}

TurnPointerComponent.schema = {
  turnPointer: {
    type: 'entity',
    default: null,
  },
}