// let cc = window.cc;
const { color4, vec3, mat4 } = cc.math;
let tileBox = cc.geometry.box.create();
cc.math.vec3.set(tileBox.size, 3.6670804, 2.601068, 5.09553576);
export default class TilePickerComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._tiles = new Array(14);
    this._mainCamera = null;
  }

  start() {
    let app = this._app;
    if (this.holds) {
      for (let i = 0; i < 14; ++i) {
        let name = `tick${i}`;
        let en = app.find(name, this.holds);
        this._tiles[i] = { key: name, entity: en, index: i };
      }
    }
    this._mainCamera = this.camera;
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
      for (let i = 0; i < this._tiles.length; ++i) {
        let tile = this._tiles[i];
        tile.entity.getWorldMatrix(mat);
        cc.math.mat4.invert(mat, mat);
        cc.math.vec3.transformMat4(rayPosLocal, pos, mat);
        cc.math.vec3.transformMat4(rayTargetLocal, target, mat);
        cc.geometry.ray.fromPoints(ray, rayPosLocal, rayTargetLocal);
        let intersectPt = cc.math.vec3.create();
        let result = false;
        result = cc.geometry.intersect.ray_box(ray, tileBox, intersectPt);
        if (result && this._mjGameNode) {
          if (this.isAvailbleTile(tile.entity))
            this._mjGameNode.emit('tile_clicked', tile);
        }
      }
    }
  }
}

TilePickerComponent.schema = {
  holds: {
    type: 'entity',
    default: null,
  },

  camera: {
    type: 'entity',
    default: null,
  },

  mjGameNode: {
    type: 'entity',
    default: null,
  },
}