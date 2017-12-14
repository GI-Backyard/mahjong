cd ~/work/engine3d-all/engine-3d
npm run build
cd ~/work/mahjong-all/mahjong
rm ./game/engine/engine-3d.dev.js
rm ./game/engine/engine-3d.dev.js.map
cp -r ~/work/engine3d-all/engine-3d/dist/engine-3d.dev.js ./game/engine/
cp -r ~/work/engine3d-all/engine-3d/dist/engine-3d.dev.js.map ./game/engine/