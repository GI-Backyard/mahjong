// let cc = window.cc;

const { resl } = cc;
const { vec3, quat, color3 } = cc.math;

// import director from './src/director';
import http from './src/http';
import net from './src/net';
import global from './src/global';
import urlParse from './src/urlParse';
import waitingConnection from './src/waitingConnection';

import userMgr from './src/userMgr';
import gameNetMgr from './src/gameNetMgr';
import mjutil from './src/mjutil';
import languageMgr from './src/languageMgr';
import audioMgr from './src/audioMgr';

// components
import StartComponent from './src/components/start';
import LoadingComponent from './src/components/loading';
import LoginComponent from './src/components/login';
import CreateRoleSexComponent from './src/components/createrolesex';

let color = color3.new(0.5, 0.5, 0.0);
let a = vec3.create();
let b = vec3.create();
let c = vec3.create();
let d = vec3.create();

let wpos = vec3.create();
let wrot = quat.create();

let curHover = null;
let curMousedown = null;
let curLineColor = color3.new(0.5, 0.5, 0.0);

class Game extends cc.App {
  constructor(canvas, opts) {
    super(canvas, opts);

    this._scenes = {};
  }

  setScenes(scenes) {
    this._scenes = scenes;
  }

  getScenes() {
    return this._scenes;
  }

  loadScene(sceneName, callback) {
    let sceneFile = this._scenes[sceneName];
    if (!sceneFile) {
      console.error(`Can not load scene ${sceneName}, because it is not existed!`);
    } else {
      let game = this;
      resl({
        manifest: {
          scene: {
            type: 'text',
            parser: JSON.parse,
            src: sceneFile
          },
        },

        onDone(data) {
          const sceneJson = data.scene;

          cc.utils.parseLevel(
            game,
            sceneJson,
            (err, level) => {
              if (err) {
                console.error(err);
              } else {
                game.loadLevel(level);
                if (callback) {
                  callback();
                }
              }
            }
          );
        }
      });
    }
  }

  init() {
    cc.args = urlParse();

    cc.sys = cc.sys || {};

    cc.sys.localStorage = localStorage;
    // init localStorage


    cc.vv = {};

    cc.vv.global = global;
    cc.vv.http = http;
    cc.vv.net = net;
    cc.vv.wc = waitingConnection;

    // hack code
    cc.vv.SI = {};

    cc.vv.userMgr = userMgr;
    cc.vv.gameNetMgr = gameNetMgr;
    gameNetMgr.initHandlers();
    cc.vv.languageMgr = languageMgr;
    languageMgr.init();
    cc.vv.audioMgr = audioMgr;
    audioMgr.init();

    cc.vv.mjutil = mjutil;

    // do not need it
    // var VoiceMgr = require("VoiceMgr");
    // cc.vv.voiceMgr = new VoiceMgr();
    // cc.vv.voiceMgr.init();

    // var Utils = require("Utils");
    // cc.vv.utils = new Utils();

    this.registerClass('game.start', StartComponent);
    this.registerClass('game.loading', LoadingComponent);
    this.registerClass('game.login', LoginComponent);
    this.registerClass('game.createrolesex', CreateRoleSexComponent);
  }

  _debugWidgets() {

    let _debugScreenWidget = (screen) => {
      cc.utils.walk(screen, ent => {
        let widget = ent.getComp('Widget');
        widget.getWorldCorners(a, b, c, d);

        if (ent === curMousedown) {
          color3.set(curLineColor, 0, 1, 0);
        } else if (ent === curHover) {
          color3.set(curLineColor, 1, 0, 0);
        } else {
          color3.copy(curLineColor, color);
        }

        // rect
        this.debugger.drawLine2D(a, b, curLineColor);
        this.debugger.drawLine2D(b, c, curLineColor);
        this.debugger.drawLine2D(c, d, curLineColor);
        this.debugger.drawLine2D(d, a, curLineColor);

        this.debugger.drawAxes2D(
          ent.getWorldPos(wpos),
          ent.getWorldRot(wrot),
          5.0
        );
      });
    };

    let activeLevel = this._activeLevel;
    for (let i = 0; i < activeLevel.children.length; ++i) {
      let child = activeLevel.children[i];
      if (child.getComp('Screen')) {
        _debugScreenWidget(child);
      }
    }
  }

  enableWigetDebug(enabled) {
    if (enabled) {
      this.on('tick', this._debugWidgets);
      this.debugger.start();
    } else {
      this.off('tick', this._debugWidgets);
      this.debugger.stop();
    }
  }
}


let mahjong = {
  Game
};

export default mahjong;