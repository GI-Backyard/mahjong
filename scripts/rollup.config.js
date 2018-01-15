'use strict';

const buble = require('rollup-plugin-buble');
const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @cocos
 * Released under the MIT License.
 */
`;

let dest = './game/dist';
let file = 'mahjong';
let moduleName = 'mahjong';

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  entry: './game.js',
  targets: [
    { dest: `${dest}/${file}.dev.js`, format: 'iife' },
    { dest: `${dest}/${file}.js`, format: 'cjs' },
  ],
  moduleName,
  banner,
  external: ['engine-3d'],
  globals: {'cc': 'window.cc'},
  sourceMap: true,
  plugins: [
    buble(),
  ]
};
