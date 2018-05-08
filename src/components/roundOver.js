// let cc = window.cc;
export default class RoundOverComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._isGameEnd = false;
  }

  start() {
    let app = this._app;
    let node = this._mjGameNode;

    let btn = this._okBtn && this._okBtn.getComp('Button');
    if (btn) {
      btn._entity.on('clicked', () => {
        if (this._isGameEnd) {
          this._gameResultUI.enabled = true;
        }
        else {
          cc.vv.net.send('ready');
        }
        this._uiRoot.enabled = false;
      })
    }

    node.on('game_over', (data) => {
      this.onGameOver(data);
    });

    node.on('game_end', (data) => {
      this._isGameEnd = true;
    });
  }

  onGameOver(data) {
    this._uiRoot.enabled = true;
  }
}

RoundOverComponent.schema = {
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

  uiRoot: {
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

  okBtn: {
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

  gameResultUI: {
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