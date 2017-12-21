let cc = window.cc;
import director from './src/director';
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

class Game extends cc.App {
  constructor(canvas, opts) {
    super(canvas, opts);
  }

  init() {
    cc.args = urlParse();

    cc.sys = cc.sys || {};
    
    cc.sys.localStorage = localStorage;
    cc.director = director;
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
  }
}

let mahjong = {
  Game
};

export default mahjong;