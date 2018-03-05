// let cc = window.cc;
const { color4, vec3, mat4 } = cc.math;
let tileBox = cc.geometry.box.create();
cc.math.vec3.set(tileBox.size, 3.6670804, 2.601068, 5.09553576);
export default class TilePickerComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._tiles = {};
    this._mainCamera = null;
    this._mjGameNode = null;
  }

  start() {
    let app = this._app;
    let en = app.find(this.holds);
    if (en) {
      for (let i = 0; i < 14; ++i) {
        let name = `tick${i}`;
        this._tiles[name] = app.find(name, en);
      }
    }
    this._mainCamera = app.find(this.camera);
    this._mjGameNode = app.find(this.mjGameNode);
  }

  isAvailbleTile(en) {
    return en && (en.children.length > 0);
  }

  tick() {
    let input = this._app._input;
    if (input.hasMouseDown) {
      let target = cc.math.vec3.create();
      let pos = cc.math.vec3.create();
      let mat = cc.math.mat4.create();
      let rayTargetLocal = cc.math.vec3.create();
      let rayPosLocal = cc.math.vec3.create();
      let ray = cc.geometry.ray.create();
      // this._tile.getWorldMatrix(mat);
      // 
      this._mainCamera.getWorldPos(pos);
      let comp = this._mainCamera.getComp('Camera');
      comp._camera.screenToWorld(target, { x: input.mouseX, y: input.mouseY, z: 1 }, this._app._canvas.width, this._app._canvas.height);
      for (let key in this._tiles) {
        this._tiles[key].getWorldMatrix(mat);
        cc.math.mat4.invert(mat, mat);
        cc.math.vec3.transformMat4(rayPosLocal, pos, mat);
        cc.math.vec3.transformMat4(rayTargetLocal, target, mat);
        cc.geometry.ray.fromPoints(ray, rayPosLocal, rayTargetLocal);
        let intersectPt = cc.math.vec3.create();
        let result = false;
        result = cc.geometry.intersect.ray_box(ray, tileBox, intersectPt);
        if (result && this._mjGameNode) {
          if(this.isAvailbleTile(this._tiles[key]))
          this._mjGameNode.emit('tile_clicked', { key });
        }
      }
    }
  }

}