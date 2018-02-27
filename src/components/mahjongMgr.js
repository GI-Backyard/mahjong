// let cc = window.cc;
let tilesNameTable = [];
for (let i = 1; i < 10; ++i) {
  tilesNameTable.push(`Dot_${i}`);
}
for (let i = 1; i < 10; ++i) {
  tilesNameTable.push(`Bam_${i}`);
}
for (let i = 1; i < 10; ++i) {
  tilesNameTable.push(`Crak_${i}`);
}
tilesNameTable.push('Wind_East');
tilesNameTable.push('Wind_North');
tilesNameTable.push('Wind_West');
tilesNameTable.push('Wind_South');

tilesNameTable.push("Dragon_Red");
tilesNameTable.push("Dragon_Green");
tilesNameTable.push("Dragon_White");

//梅、兰、竹、菊
for (let i = 1; i < 5; ++i) {
  tilesNameTable.push(`Flower_${i}`);
}

//春、夏、秋、冬
for (let i = 1; i < 5; ++i) {
  tilesNameTable.push(`Season_${i}`);
}
export default class MahJongMgr extends cc.ScriptComponent {
  constructor() {
    super();
    cc.vv.mahjongmgr = this;
  }

  start() {
    this._initViews();
    console.log('mahjongmgr runs');
  }

  _initViews() {
    let app = this._app;
  }

  instantiateBlankMjTile(callback) {
    let uuid = this['Dragon_Blank'];
    let app = this._app;
    app.assets.load(uuid, (err, asset) => {
      if (err) {
        callback && callback(err, null);
      } else {
        let en = asset.instantiate();
        if (en) {
          callback && callback(null, en);
        } else {
          callback && callback('tile is not a prefab', null);
        }
      }
    });
    return null;
  }

  instantiateMjTile(id, callback) {
    let uuid = this[tilesNameTable[id]];
    let app = this._app;
    app.assets.load(uuid, (err, asset) => {
      if (err) {
        callback && callback(err, null);
      } else {
        let en = asset.instantiate();
        if (en) {
          callback && callback(null, en);
        } else {
          callback && callback('tile is not a prefab', null);
        }
      }
    });
    return null;
  }

  getMahjongType(id) {
    if (id >= 0 && id < 9) {
      return 0;
    }
    else if (id >= 9 && id < 18) {
      return 1;
    }
    else if (id >= 18 && id < 27) {
      return 2;
    }
  }

  sortMJ(mahjongs, dingque) {
    mahjongs.sort((a, b) => {
      var ja = cc.vv.gameNetMgr.isJing(a);
      var jb = cc.vv.gameNetMgr.isJing(b);
      if (ja && jb) {
        return a - b;
      }
      if (ja) {
        return -1;
      }
      if (jb) {
        return 1;
      }

      if (dingque >= 0) {
        var t1 = this.getMahjongType(a);
        var t2 = this.getMahjongType(b);
        if (t1 != t2) {
          if (dingque == t1) {
            return 1;
          }
          else if (dingque == t2) {
            return -1;
          }
        }
      }
      return a - b;
    });
  }
}
