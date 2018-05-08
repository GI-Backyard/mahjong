// let cc = window.cc;
const _inputMsg = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const _maxCharNum = 6;
export default class joinRoomComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._chars = [];
    this._nums = new Array(_maxCharNum);
  }

  start() {
    let app = this._app;
    let en = this._closeBtn;
    let btn = en && en.getComp('Button');
    btn._entity.on('clicked', () => {
      this.closeDiag();
    });

    this._registerBtnEvent(app, this.btn_0, '0');
    this._registerBtnEvent(app, this.btn_1, '1');
    this._registerBtnEvent(app, this.btn_2, '2');
    this._registerBtnEvent(app, this.btn_3, '3');
    this._registerBtnEvent(app, this.btn_4, '4');
    this._registerBtnEvent(app, this.btn_5, '5');
    this._registerBtnEvent(app, this.btn_6, '6');
    this._registerBtnEvent(app, this.btn_7, '7');
    this._registerBtnEvent(app, this.btn_8, '8');
    this._registerBtnEvent(app, this.btn_9, '9');

    this._registerBtnEvent(app, this.btn_del, 'del');
    this._registerBtnEvent(app, this.btn_clear, 'clear');

    let _locateNumber = (index, name) => {
      let en = name
      let text = en && en.getComp('Text');
      this._nums[index] = text;
    }

    _locateNumber(0, this.num_0);
    _locateNumber(1, this.num_1);
    _locateNumber(2, this.num_2);
    _locateNumber(3, this.num_3);
    _locateNumber(4, this.num_4);
    _locateNumber(5, this.num_5);
    this._refreshRoomNumber();
  }

  openDiag() {
    if (this._diag) {
      this._diag.enabled = true;
    }
  }

  closeDiag() {
    if (this._diag) {
      this._diag.enabled = false;
    }
  }

  _registerBtnEvent(app, name, msg) {
    let en = name;
    let btn = en && en.getComp('Button');
    btn._entity.on('clicked', () => {
      this._onBtnMsg(msg);
    });
  }

  _onBtnMsg(msg) {
    if (msg === 'clear') {
      this._chars.length = 0;
      this._refreshRoomNumber();
    } else if (msg === 'del') {
      if (this._chars.length > 0) {
        this._chars.splice(this._chars.length - 1, 1);
        this._refreshRoomNumber();
      }
    } else {
      if (_inputMsg.indexOf(msg) !== -1 && this._chars.length < _maxCharNum) {
        this._chars.push(msg);
        this._refreshRoomNumber();
        if (this._chars.length === _maxCharNum) {
          this._tryEnterRoom();
        }
      }
    }
  }

  _refreshRoomNumber() {
    for (let i = 0; i < _maxCharNum; ++i) {
      this._nums[i].text = this._chars[i] || ' ';
    }
  }

  _tryEnterRoom() {
    // parse room id
    let roomId = '';
    for (let i = 0; i < _maxCharNum; ++i) {
      roomId += this._chars[i];
      //  += parseInt() * Math.pow(10, _maxCharNum - i - 1);
    }
    cc.vv.userMgr.enterRoom(roomId,
      (ret) => {
        if (ret.errcode === 0) {
          // this.node.active = false;
          this.closeDiag();
        }
        else {
          let content = '网络错误，请重试';
          if (ret.errcode == -2) {
            content = "房间[" + roomId + "]不存在，请重新输入!";
          }
          if (ret.errcode == 4) {
            content = "房间[" + roomId + "]已满!";
          }
          else if (ret.errcode == 5) {
            content = "钻石不足，加入房间失败";
          }
          else if (ret.errcode == 6) {
            content = "防作弊系统提醒您\n\n距离过近，无法加入游戏";
          }
          // cc.vv.alert.show("提示", content);
          console.warn(`ERROR: ${content}`);
          // clear all
          this._onBtnMsg('clear');
        }
      }
    );
  }

  tick() {
  }
}

joinRoomComponent.schema = {
  closeBtn: {
    type: 'object',
    default: null,
    parse(app, value, propInfo, entities) {
      if (entities) {
        if (propInfo.type === 'object'&&value) {
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

  diag: {
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

  btn_0: {
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

  btn_1: {
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

  btn_2: {
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

  btn_3: {
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

  btn_4: {
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

  btn_5: {
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

  btn_6: {
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

  btn_7: {
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

  btn_8: {
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

  btn_9: {
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

  btn_clear: {
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

  btn_del: {
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

  num_0: {
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

  num_1: {
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

  num_2: {
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

  num_3: {
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

  num_4: {
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

  num_5: {
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
