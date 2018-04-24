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
    this._submitBtn = null;
    this._sex = 'male';
    this._name = '';
    this._makeRandomName();
  }

  _register(entity, sex) {
    if (entity) {
      let btn = entity.getComp('Button');
      if (btn) {
        btn._entity.on('clicked',() => {
          this._sex = sex;
          console.log(`Change create role sex to ${sex}`);
        });
      }
    }
  }

  _applyRefs() {
    let app = this._app;
    // apply male toggle
    let en = this.maleToggle;
    this._maleToggle = en && en.getComp('Toggle');

    // apply female toggle
    en = this.femaleToggle;
    this._femaleToggle = en && en.getComp('Toggle');

    // apply toggle group
    en = this.toggleGroup;
    this._toggleGroup = en && en.getComp('ToggleGroup');
    this._toggleGroup.allowSwitchOff = false;
    this._maleToggle.toggleGroup = this._toggleGroup;
    this._femaleToggle.toggleGroup = this._toggleGroup;

    // apply name table
    en = this.nameTable;
    this._nameTable = en && en.getComp('Text');
    this._nameTable.text = this._name;

    // apply random btn
    en = this.randomBtn;
    this._randomBtn = en && en.getComp('Button');

    // apply submit btn
    en = this.submit;
    this._submitBtn = en && en.getComp('Button');

    // todo: register callbacks
    this._maleToggle._entity.on('clicked', (e) => {
      if (e.component.checked) {
        this._sex = 'male';
      }
    });

    this._femaleToggle._entity.on('clicked', (e) => {
      if (e.component.checked) {
        this._sex = 'female';
      }
    });

    this._randomBtn._entity.on('clicked', () => {
      this._makeRandomName();
      this._nameTable.text = this._name;
    });

    this._submitBtn._entity.on('clicked', () => {
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

CreateRoleSexComponent.schema = {
  femaleToggle: {
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

  maleToggle: {
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

  toggleGroup: {
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

  randomBtn: {
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

  submit: {
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

  nameTable: {
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