# mahjong
##搭建环境：
* 游戏代码
	
	仓库地址: https://github.com/cocos-3d-demos/mahjong
* 安装游戏引擎
	
	游戏依赖于引擎项目和UI项目,其地址分别是：
	https://github.com/cocos-creator/engine-3d
	https://github.com/cocos-creator/ui-kit-3d
	在game目录下建立engine目录
	将引擎和ui模块的代码编译后的模块代码engine.dev.js, ui-kit.dev.js拷贝到engine目录中
	
* 导入游戏资源

	游戏资源依赖于unity项目和导出工具
	unity资源仓库：https://github.com/cocos-3d-demos/mahjong-unity
	使用u3d-exporter导出，将导出的资源放置于
	game/assets/mahjong-unity目录中
	
* 构建游戏
	npm run build 或者 npm run dev均可
* 进入游戏
	npm run server, 使用提示的链接访问游戏

	**note:当游戏多开时，需要在访问端口后加上/?account=XXX来区分(如：localhost:8080/?account=test1)**
