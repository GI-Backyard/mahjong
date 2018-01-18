// let cc = window.cc;

export default class createRoomComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._diag = null;
  }

  _registerToggleGroup(app, groupName, toggles) {
    let en, comp, checkComp;
    let group;
    checkComp = null;
    en = app.find(groupName);
    group = en && en.getComp('ToggleGroup');
    for (let i = 0; i < toggles.length; ++i) {
      en = app.find(toggles[i]);
      comp = en && en.getComp('Toggle');
      // todo add callbacks here
      comp.toggleGroup = group;
      checkComp = checkComp || comp;
    }

    checkComp.check();
  }

  _registerSingleToggle(app, name, toggled, callback) {
    let en = app.find(name);
    let comp = en && en.getComp('Toggle');
    if (callback) {
      // todo add callback here
    }

    if (toggled) {
      comp.check();
    } else {
      comp.uncheck();
    }
  }

  start() {
    let app = this._engine;
    let en = app.find(this.closeBtn);
    let btn = en && en.getComp('Button');
    btn._clickListeners.push(() => {
      this.closeDiag();
    });

    this._diag = app.find(this.diag);

    // appy wanfa
    this._registerToggleGroup(app, this.wanfaGroup, [this.xzddToggle, this.xlchToggle]);

    // apply pay
    this._registerToggleGroup(app, this.payGroup, [this.payfzToggle, this.payaaToggle]);

    // apply round
    this._registerToggleGroup(app, this.roundGroup, [this.round4Toggle, this.round8Toggle, this.round16Toggle]);

    // apply times
    this._registerToggleGroup(app, this.timesGroup, [this.time2Toggle, this.time3Toggle, this.time4Toggle]);

    // apply zm
    this._registerToggleGroup(app, this.zimoGroup, [this.zimojdToggle, this.zimojfToggle]);

    // apply dian gang hua
    this._registerToggleGroup(app, this.dghGroup, [this.dghfpToggle, this.dghzmToggle]);

    // apply single toggles
    this._registerSingleToggle(app, this.hszToggle, true, null);
    this._registerSingleToggle(app, this.yjjdToggle, true, null);
    this._registerSingleToggle(app, this.mqzzToggle, true, null);
    this._registerSingleToggle(app, this.tdhToggle, true, null);
    this._registerSingleToggle(app, this.fzbToggle, false, null);
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

  update() {
  }
}
