cd ~/work/engine3d-all/ui-kit-3d
npm run build
cd ~/work/mahjong-all/mahjong
rm ./game/engine/ui-kit.dev.js
rm ./game/engine/ui-kit.dev.js.map
cp -r ~/work/engine3d-all/ui-kit-3d/dist/ui-kit.dev.js ./game/engine/
cp -r ~/work/engine3d-all/ui-kit-3d/dist/ui-kit.dev.js.map ./game/engine/