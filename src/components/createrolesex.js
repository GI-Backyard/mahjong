let cc = window.cc;

export default class CreateRoleSexComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this.maleBtn = null;
    this.femaleBtn = null;
    this.sex = 'male';
  }

  _register(entity, sex) {
    if (entity) {
      let btn = entity.getComp('Button');
      if (btn) {
        btn._clickListeners.push(() => {
          this.sex = sex;
          console.log(`Change create role sex to ${sex}`);
        });
      }
    }
  }
  start() {
    this._register(this.maleBtn, 'male');
    this._register(this.femaleBtn, 'female');
  }

}