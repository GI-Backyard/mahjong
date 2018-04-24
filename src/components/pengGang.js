// let cc = window.cc;
export default class PengGangComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._sidePengGangNodes = [];
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode;

    node.on('peng_notify', (data) => {
      this.onPengGangChanged(data);
    });

    node.on('gang_notify', (data) => {
      this.onPengGangChanged(data.seatData);
    });
    node.on('game_begin', () => {
      this.clearPengGangPai();
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

  clearPengGangPai() {
    let app = this._app;
    for (let i = 0; i < 4; ++i) {
      let sidePengGangRoot = this._sidePengGangNodes[i];
      for (let j = 0; j < 4; ++j) {
        let pengGangGroup = sidePengGangRoot[j];
        for (let k = 0; k < 4; ++k) {
          let tile = app.find(`${k}`, pengGangGroup);
          if (tile.children[0]) {
            tile.removeChild(tile.children[0]);
          }
        }
      }
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
            entity.on('ready', () => {
              entity.setParent(tile);
              tile.enabled = false;
              tile.enabled = true;
              entity.enabled = false;
              entity.enabled = true;
            })
          }
        });
      }
    }
    // console.log(`a new ${flag} pai id=${mjID}, index= ${index}, side = ${pengGangNode.parent.name} added`);
  }
}

PengGangComponent.schema = {
  gameRoot: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },

  mjGameNode: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object' && value) {
          let entIdx = value.indexOf('e');
          if (entIdx !== -1) {
            value = value.split('e').join('');
          }

          entIdx = parseInt(value);
          return entities[entIdx];
        }
      }

      return value;
    },
  },
}