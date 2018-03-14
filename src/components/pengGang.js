// let cc = window.cc;
export default class PengGangComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._mjGameNode = null;
    this._gameRoot = null;
    this._sidePengGangNodes = [];
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode = app.find(this.mjGameNode);
    this._gameRoot = app.find(this.gameRoot);

    node.on('peng_notify', (data) => {
      this.onPengGangChanged(data);
    });

    node.on('gang_notify', (data) => {
      this.onPengGangChanged(data.seatData);
    });
    node.on('game_begin', () => {
      let seats = cc.vv.gameNetMgr.seats;
      for (let i in seats) {
        this.onPengGangChanged(seats[i]);
      }
    });

    let seatsIndices = ['mine', 'right', 'oppo', 'left'];
    for (let i = 0; i < seatsIndices.length; ++i) {
      let side = app.find(seatsIndices[i], this._gameRoot);
      let sizePengGang = app.find('penggang', side);
      if (sizePengGang === null) {
        console.error(`sizePengGang for side ${seatsIndices[i]} is not available.`);
      }

      let sidePengGangNodes = [];
      for (let i = 0; i < 4; ++i) {
        let pengGangNode = app.find(`pg${i}`, sizePengGang);
        if (pengGangNode === null) {
          console.error(`pengGangNode for side ${seatsIndices[i]}, index ${i} is not available.`);
        }
        sidePengGangNodes.push(pengGangNode);
      }
      this._sidePengGangNodes.push(sidePengGangNodes);
    }

    let seats = cc.vv.gameNetMgr.seats;
    for (let i in seats) {
      this.onPengGangChanged(seats[i]);
    }
  }

  onPengGangChanged(seatData) {
    if (seatData.angangs == null && seatData.diangangs == null && seatData.wangangs == null && seatData.pengs == null) {
      return;
    }

    let localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);

    let index = 0;
    let gangs = seatData.angangs;
    for (let i = 0; i < gangs.length; ++i) {
      let mjid = gangs[i];
      let sidePengGang = this._sidePengGangNodes[localIndex];
      this.updatePengGangPai(sidePengGang, index, mjid, 'gang');
      index++;
    }

    gangs = seatData.diangangs;
    for (let i = 0; i < gangs.length; ++i) {
      let mjid = gangs[i];
      let sidePengGang = this._sidePengGangNodes[localIndex];
      this.updatePengGangPai(sidePengGang, index, mjid, 'gang');
      index++;
    }

    gangs = seatData.wangangs;
    for (let i = 0; i < gangs.length; ++i) {
      let mjid = gangs[i];
      let sidePengGang = this._sidePengGangNodes[localIndex];
      this.updatePengGangPai(sidePengGang, index, mjid, 'gang');
      index++;
    }

    let pengs = seatData.pengs;
    if (pengs) {
      for (let i = 0; i < pengs.length; ++i) {
        let mjid = pengs[i];
        let sidePengGang = this._sidePengGangNodes[localIndex];
        this.updatePengGangPai(sidePengGang, index, mjid, 'peng');
        index++;
      }
    }

    console.log('onPengGangChanged called! ');
  }

  updatePengGangPai(sizePengGang, index, mjID, flag) {
    let app = this._app;
    let pengGangNode = sizePengGang[index];
    if (pengGangNode) {
      for (let i = 0; i < 4; ++i) {
        let tile = app.find(`${i}`, pengGangNode);
        tile.removeChild(tile.children[0]);
        if (flag === 'peng' && i === 3) {
          continue;
        }
        cc.vv.mahjongmgr.instantiateMjTile(mjID, (err, entity) => {
          if (!err && entity) {
            entity.setParent(tile);
          }
          tile.enabled = false;
          tile.enabled = true;
          entity.enabled = false;
          entity.enabled = true;
        });
      }
    }
    // console.log(`a new ${flag} pai id=${mjID}, index= ${index}, side = ${pengGangNode.parent.name} added`);
  }
}