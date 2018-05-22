// let cc = window.cc;
export default class ChupaiComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._sideChupaiNodes = [];
    this._chupaiPointerPos = cc.math.vec3.create();
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode;

    let seatsIndices = ['mine', 'right', 'oppo', 'left'];
    for (let i = 0; i < seatsIndices.length; ++i) {
      let side = app.find(seatsIndices[i], this._gameRoot);
      let sideChupaiRoot = app.find('outs', side);
      if (sideChupaiRoot === null) {
        console.error(`sideChupaiRoot for side ${seatsIndices[i]} is not available.`);
      }

      let sideChupaiNodes = [];
      for (let i = 0; i < sideChupaiRoot.children.length; ++i) {
        let chupaiNode = app.find(`${i}`, sideChupaiRoot);
        if (chupaiNode === null) {
          console.error(`ChupaiNode for side ${seatsIndices[i]}, index ${i} is not available.`);
        }
        sideChupaiNodes.push(chupaiNode);
      }

      this._sideChupaiNodes.push(sideChupaiNodes);
    }

    node.on('game_begin', (data) => {
      this.initAllFolds();
      this._chupaiPointer.lpos.x = this._chupaiPointer.lpos.y = this._chupaiPointer.lpos.z = 0;
    });

    node.on('peng_notify', () => {
      let seatdata = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.turn];
      this.initFolds(seatdata);
      this._chupaiPointer.lpos.x = this._chupaiPointer.lpos.y = this._chupaiPointer.lpos.z = 0;
    });

    node.on('gang_notify', () => {
      let seatdata = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.turn];
      this.initFolds(seatdata);
      this._chupaiPointer.lpos.x = this._chupaiPointer.lpos.y = this._chupaiPointer.lpos.z = 0;
    });

    node.on('hupai', () => {
      let seatdata = cc.vv.gameNetMgr.seats[cc.vv.gameNetMgr.turn];
      this.initFolds(seatdata);
    });

    node.on('game_sync', (data) => {
      // console.log("game_sync");
      this.initAllFolds();
    });

    node.on('game_chupai_notify', (data) => {
      this.initFolds(data.seatData);
    });

    node.on('game_ation_chupai_notify', (data) => {
      this.initFolds(data);
    });


    node.on('guo_notify', (data) => {
      this.initFolds(data);
    });

    this.initAllFolds();
  }

  initAllFolds() {
    var seats = cc.vv.gameNetMgr.seats;
    for (var i in seats) {
      this.initFolds(seats[i]);
    }
  }

  initFolds(seatData) {
    let folds = seatData.folds;
    if (folds == null) {
      return;
    }
    let localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);

    let sideChupai = this._sideChupaiNodes[localIndex];
    for (let i = 0; i < sideChupai.length; ++i) {
      sideChupai[i].removeChild(sideChupai[i].children[0]);
    }
    for (let i = 0; i < folds.length; ++i) {
      cc.vv.mahjongmgr.instantiateMjTile(folds[i], (err, entity) => {
        if (!err && entity) {
          entity.on('ready', () => {
            entity.setParent(sideChupai[i]);
            sideChupai[i].enabled = false;
            sideChupai[i].enabled = true;
            entity.enabled = false;
            entity.enabled = true;
            let pointerTurn = cc.vv.gameNetMgr.gamestart ? cc.vv.gameNetMgr.lastChuPaiTurn : cc.vv.gameNetMgr.turn;
            if (seatData.seatindex == pointerTurn && i == (folds.length - 1)) {
              sideChupai[i].getWorldPos(this._chupaiPointerPos);
              this._chupaiPointer.setWorldPos(this._chupaiPointerPos);
            }
          });
        }
      });
      // logStr += folds[i] + ((i === (folds.length - 1)) ? ']' : ',');
    }
    // console.log(logStr);
  }
}

ChupaiComponent.schema = {
  gameRoot: {
    type: 'entity',
    default: null,
  },

  mjGameNode: {
    type: 'entity',
    default: null,
  },

  chupaiPointer: {
    type: 'entity',
    default: null,
  },
}