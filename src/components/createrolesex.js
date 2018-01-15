let cc = window.cc;

let _randomName1 = [
  'Brave',
  'Honest',
  'Lovely',
  'Cute',
  'Strong',
  'Heavy',
  'Red',
  'Blue',
  'Green',
  'Black',
  'Crazy',
  'Gangly'
];

let _randomName2 = [
  'Bush',
  'Barck',
  'Cindy',
  'Cote',
  'Dunken',
  'Doll',
  'Jack',
  'Mary',
  'John',
  'Himi',
  'Mia'
];

export default class CreateRoleSexComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._maleToggle = null;
    this._femaleToggle = null;
    this._toggleGroup = null;
    this._nameTable = null;
    this._randomBtn = null;
    this._submitBtn = null;
    this._sex = 'male';
    this._name = '';
    this._makeRandomName();
  }

  _register(entity, sex) {
    if (entity) {
      let btn = entity.getComp('Button');
      if (btn) {
        btn._clickListeners.push(() => {
          this._sex = sex;
          console.log(`Change create role sex to ${sex}`);
        });
      }
    }
  }

  _applyRefs() {
    let app = this._engine;
    // apply male toggle
    let en = app.find(this.maleToggle);
    this._maleToggle = en && en.getComp('Toggle');

    // apply female toggle
    en = app.find(this.femaleToggle);
    this._femaleToggle = en && en.getComp('Toggle');

    // apply toggle group
    en = app.find(this.toggleGroup);
    this._toggleGroup = en && en.getComp('ToggleGroup');
    this._toggleGroup.allowSwitchOff = false;
    this._femaleToggle.toggleGroup = this._toggleGroup;
    this._maleToggle.toggleGroup = this._toggleGroup;
    this._maleToggle.check();

    // apply name table
    en = app.find(this.nameTable);
    this._nameTable = en && en.getComp('Text');
    this._nameTable.text = this._name;

    // apply random btn
    en = app.find(this.randomBtn);
    this._randomBtn = en && en.getComp('Button');

    // apply submit btn
    en = app.find(this.submit);
    this._submitBtn = en && en.getComp('Button');

    // todo: register callbacks
    this._maleToggle._toggleListeners.push((toggle) => {
      if (toggle.toggled) {
        this._sex = 'male';
      }
    });

    this._femaleToggle._toggleListeners.push((toggle) => {
      if (toggle.toggled) {
        this._sex = 'female';
      }
    });

    this._randomBtn._clickListeners.push(() => {
      this._makeRandomName();
      this._nameTable.text = this._name;
    });

    this._submitBtn._clickListeners.push(() => {
      // console.warn(`to do create role ${this._name}, ${this._sex}`);
      cc.vv.userMgr.create(this._name);
    });

  }

  start() {
    this._applyRefs();
  }

  _makeRandomName() {
    let i1 = Math.floor((Math.random() * 1e5) % _randomName1.length);
    let i2 = Math.floor((Math.random() * 1e5) % _randomName2.length);
    this._name = `${_randomName1[i1]} ${_randomName2[i2]}`;
  }

}