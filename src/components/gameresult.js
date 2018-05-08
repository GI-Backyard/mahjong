// let cc = window.cc;

export default class GameResultComponent extends cc.ScriptComponent {
  constructor() {
    super();
  }

  start() {
    let app = this._app;
    let en = app.find('game_result/btn_ok', this._diag);
    let btn = en && en.getComp('Button');
    if (btn) {
      btn._entity.on('clicked',() => {
        cc.game.loadScene('hall');
      })
    }

    this._mjGameNode.on('game_end', () => {
      this._diag.enabled = true;
    })
  }

}

GameResultComponent.schema = {
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
