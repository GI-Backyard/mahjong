// let cc = window.cc;
const { color4, vec3, mat4 } = cc.math;
export default class TestPickComponent extends cc.ScriptComponent {
  constructor() {
    super();
    this._tile = null;
    this._box = cc.geometry.box.create();
    this._mainCamera = null;
    cc.math.vec3.set(this._box.size, 3.6670804, 2.601068, 5.09553576);
  }

  start() {
    let app = this._app;
    this._tile = app.find('Bam_1');
    this._mainCamera = app.find('Main Camera');
    console.log('TestPickComponent runs');
  }

  tick() {
    let input = this._app._input;
    if (input.hasMouseDown) {
      let target = cc.math.vec3.zero();
      let pos = cc.math.vec3.zero();
      let mat = cc.math.mat4.create();
      this._tile.getWorldMatrix(mat);
      cc.math.mat4.invert(mat, mat);
      this._mainCamera.getWorldPos(pos);
      let comp = this._mainCamera.getComp('Camera');
      comp._camera.screenToWorld(target, { x: input.mouseX, y: input.mouseY, z: 1 }, this._app._canvas.width, this._app._canvas.height);
      cc.math.vec3.transformMat4(pos, pos, mat);
      cc.math.vec3.transformMat4(target, target, mat);
      let ray = cc.geometry.ray.create();
      cc.geometry.ray.fromPoints(ray, pos, target);
      // this.getPickRay(ray, this._mainCamera, input.mouseX, input.mouseY, this._app._canvas.width, this._app._canvas.height);
      console.log(`ray ori is (${ray.o.x},${ray.o.y}, ${ray.o.z})`);
      console.log(`ray dir is (${ray.d.x},${ray.d.y}, ${ray.d.z})`);
      let intersectPt = cc.math.vec3.zero();
      let result = false;
      result = cc.geometry.intersect.ray_box(ray, this._box, intersectPt);
      console.log(` tile is ${result ? '' : 'not'} picked!`);
    }
  }

}