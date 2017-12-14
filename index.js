import http from './src/http.js';
import net from './src/net.js';

// components
import StartComponent from './src/components/start';

class Game {
  constructor(app) {
    this.app = app;
  }

  init() {
    cc.vv = {};
    // hack code
    // cc.vv.global = require("Global");
    cc.vv.http = http;
    cc.vv.net = net;


    // todo from here
    // var UserMgr = require("UserMgr");
    // cc.vv.userMgr = new UserMgr();

    // var GameNetMgr = require("GameNetMgr");
    // cc.vv.gameNetMgr = new GameNetMgr();
    // cc.vv.gameNetMgr.initHandlers();

    // var VoiceMgr = require("VoiceMgr");
    // cc.vv.voiceMgr = new VoiceMgr();
    // cc.vv.voiceMgr.init();

    // var AudioMgr = require("AudioMgr");
    // cc.vv.audioMgr = new AudioMgr();
    // cc.vv.audioMgr.init();

    // var Utils = require("Utils");
    // cc.vv.utils = new Utils();

    // var MJUtil = require("MJUtil");
    // cc.vv.mjutil = new MJUtil();

    // var LanguageMgr = require('LanguageMgr');
    // cc.vv.languageMgr = new LanguageMgr();
    // cc.vv.languageMgr.init();

    // cc.args = urlParse();

    app.registerClass('game.start', StartComponent);
  }
}

let mahjong = {
  Game
};

export default mahjong;