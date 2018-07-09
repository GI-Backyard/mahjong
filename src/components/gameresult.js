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
      this._diag.active = true;
    })
  }

}

GameResultComponent.schema = {
  diag: {
    type: 'entity',
    default: null,
  },

  mjGameNode: {
    type: 'entity',
    default: null,
  },
}
