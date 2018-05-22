// let cc = window.cc;

export default class DingQueComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._dingqueTips = [];
    this._queBtns = []; // tong, tiao, wan order
  }

  start() {
    if (cc.vv == null) {
      return;
    }
    this.initView();
    this.initDingQue();
    this.initEventHandlers();

    // console.error(`DingQue component is implementing`);
  }

  initView() {
    let app = this._app;
    this._dingqueRoot.enabled = cc.vv.gameNetMgr.isDingQueing;

    this._queBtns.push(app.find('tong_sel/tong', this._dingqueRoot));
    this._queBtns.push(app.find('tiao_sel/tiao', this._dingqueRoot));
    this._queBtns.push(app.find('wan_sel/wan', this._dingqueRoot));

    let sideOrder = ['myself', 'right', 'up', 'left'];
    for (let i = 0; i < sideOrder.length; ++i) {
      this._dingqueTips.push(app.find(sideOrder[i], this._dingqueRoot));
    }
    for (let i = 0; i < this._queBtns.length; ++i) {
      let btn = this._queBtns[i] && this._queBtns[i].getComp('Button');
      if (btn) {
        btn._entity.on('clicked', () => {
          this.onDingQueSelected(i);
        });
      }
    }

    // seat上面的缺一门标志
    // var arr = ["myself", "right", "up", "left"];
    // for (var i = 0; i < arr.length; ++i) {
    //   var side = gameChild.getChildByName(arr[i]);
    //   var seat = side.getChildByName("seat");
    //   var dingque = seat.getChildByName("que");
    //   this.dingques.push(dingque);
    // }
    this.reset();

    if (cc.vv.gameNetMgr.gamestate == "dingque") {
      this.showDingQueChoice();
    }
  }

  clearQue() {
    // seat上面的缺一门标志
    // var arr = ["tong", "tiao", "wan"];
    // for (var j = 0; j < this.dingques.length; j++) {
    //   for (var i = 0; i < arr.length; ++i) {
    //     var node = this.dingques[j].getChildByName(arr[i]);
    //     node.active = false;
    //   }
    // }

  }

  onDingQueSelected(queID) {
    let btn = this._queBtns[queID];
    if (btn) {
      btn.parent.getComp('Image').enabled = true;
    }
    for (let i = 0; i < this._queBtns.length; ++i) {
      this._queBtns[i].enabled = false;
    }

    // todo send game logic msg
    cc.vv.gameNetMgr.dingque = queID;
    cc.vv.net.send("dingque", queID);
  }

  initEventHandlers() {
    var self = this;
    this._mjGameNode.on('game_dingque', function (data) {
      self.showDingQueChoice();
    });

    this._mjGameNode.on('game_dingque_notify', function (data) {
      var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(data.detail);
      var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
      console.log("game_dingque_notify:" + localIndex);
      self._dingqueTips[localIndex].enabled = true;
      // self.tips[localIndex].node.active = true;
    });

    this._mjGameNode.on('game_dingque_finish', function () {
      //通知每一个玩家定缺的花色
      // self.queYiMen.active = false;
      self._dingqueRoot.enabled = false;
      cc.vv.gameNetMgr.isDingQueing = false;
      // self.initDingQue();
    });
  }

  showDingQueChoice() {
    // this._keep_out.active = true;//关闭触摸
    // this.queYiMen.active = true;
    this._dingqueRoot.enabled = true;
    //还原上盘被定缺消失的麻将
    for (let i = 0; i < this._queBtns.length; ++i) {
      this._queBtns[i].enabled = true;
    }
    // this.dingques_item[0].active = true;
    // this.dingques_item[1].active = true;
    // this.dingques_item[2].active = true;
    var sd = cc.vv.gameNetMgr.getSelfData();
    var typeCounts = [0, 0, 0];
    for (var i = 0; i < sd.holds.length; ++i) {
      var pai = sd.holds[i];
      var type = cc.vv.mahjongmgr.getMahjongType(pai);
      typeCounts[type]++;
    }

    var min = 65535;
    var minIndex = 0;
    for (var i = 0; i < typeCounts.length; ++i) {
      if (typeCounts[i] < min) {
        min = typeCounts[i];
        minIndex = i;
      }
    }

    //动画提示哪个牌少
    // var arr = ["tong", "tiao", "wan"];
    // for (var i = 0; i < arr.length; ++i) {
    //   var node = this.queYiMen.getChildByName(arr[i]);
    //   if (minIndex == i) {
    //     node.getComponent(cc.Animation).play("dingque_tuijian");
    //   }
    //   else {
    //     node.getComponent(cc.Animation).stop();
    //   }
    //   //this.queYiMen.getChildByName(arr[i]).getChildByName('jian').active = minIndex == i;    
    // }

    this.reset();
    //定缺tips重置为false
    for (let i = 0; i < this._dingqueTips.length; ++i) {
      this._dingqueTips[i].enabled = false;
    }
  }

  initDingQue() {
    //seat上面的缺一门标志
    // var arr = ["tong", "tiao", "wan"];
    // var data = cc.vv.gameNetMgr.seats;
    // for (var i = 0; i < data.length; ++i) {
    //   var que = data[i].dingque;
    //   if (que == null || que < 0 || que >= arr.length) {
    //     que = null;
    //   }
    //   else {
    //     que = arr[que];
    //   }

    //   var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
    //   if (que) {
    //     this.dingques[localIndex].getChildByName(que).active = true;
    //   }
    // }
  }

  reset() {
    this.setInteractable(true);
    for (var i = 0; i < this._queBtns.length; ++i) {
      this._queBtns[i].enabled = true;
      let img = this._queBtns[i].parent.getComp('Image');
      if (img) {
        img.enabled = false;
      }
    }

    //seat上的缺一门标识
    // for (var i = 0; i < this.dingques.length; ++i) {
    //   for (var j = 0; j < this.dingques[i].children.length; ++j) {
    //     this.dingques[i].children[j].active = false;
    //   }
    // }
  }

  onQueYiMenClicked(event) {
    var type = 0;

    if (event.target.name == "tong") {
      type = 0;
    }
    else if (event.target.name == "tiao") {
      type = 1;
    }
    else if (event.target.name == "wan") {
      type = 2;
    }

    for (var i = 0; i < this.selected.length; ++i) {
      this.selected[i].active = false;

    }

    for (var i = 0; i < this.dingques_item.length; ++i) {
      this.dingques_item[i].active = false;
    }
    this.dingques_item[type].active = true;
    this.selected[type].active = true;


    //this.setInteractable(false);
  }

  setInteractable(value) {
    // this.queYiMen.getChildByName("tong").getComponent(cc.Button).interactable = value;
    // this.queYiMen.getChildByName("tiao").getComponent(cc.Button).interactable = value;
    // this.queYiMen.getChildByName("wan").getComponent(cc.Button).interactable = value;
  }

  // tick() {
  // }
}

DingQueComponent.schema = {
  dingqueRoot: {
    type: 'entity',
    default: null,
  },

  mjGameNode: {
    type: 'entity',
    default: null,
  },
}
