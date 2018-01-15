cd ~/work/engine3d-all/engine-3d
npm run build
cd ~/work/mahjong-all/mahjong
rm ./game/engine/engine.dev.js
rm ./game/engine/engine.dev.js.map
cp -r ~/work/engine3d-all/engine-3d/dist/engine.dev.js ./game/engine/
cp -r ~/work/engine3d-all/engine-3d/dist/engine.dev.js.map ./game/engine/