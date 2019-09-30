var util = require('util');
cc.Class({
    extends: cc.Component,

    properties: {
		scoreNode:cc.Node,
		propIcon:cc.Node,
		flag:false,
    },
	initGame(){
		console.log('initGame');
		var manager = cc.director.getCollisionManager();
		manager.enabled = true;
		this.node.on(cc.Node.EventType.TOUCH_START,this.tankeJump,this);
		this.node.on(cc.Node.EventType.TOUCH_END,this.tankeEnd,this);
		this.node.on(cc.Node.EventType.TOUCH_CANCLE,this.tankeEnd,this);
		this.gameTanke = cc.instantiate(GlobalData.assets['tanke']);
		this.node.addChild(this.gameTanke);
		this.gameTanke.position = cc.v2(-260,0);
		this.gameTanke.active = true;
		this.gameTanke.getComponent('tanke').startGame();
		this.freshZaw();
		//随机初始化一个肤色
		GlobalData.runTime.particleSkin = util.getRandomNum(GlobalData.ParticleConf.length);
		GlobalData.game.audioManager.getComponent('AudioManager').playGameBg();
	},
	showAnimate(type){
		var ani = cc.instantiate(GlobalData.assets['actionLabel']);
		ani.x = this.gameTanke.x;
		ani.y = this.gameTanke.y + 70;
		if(type == 1){
			ani.getComponent(cc.Label).string = '加速+';
		}else if(type == 2){
			ani.getComponent(cc.Label).string = '力量+';
		}
		ani.zIndex = 5;
		this.node.addChild(ani);
		ani.active = true;
		var swap = cc.spawn(cc.moveTo(1,cc.v2(ani.x,ani.y + 100)),cc.fadeOut(1));
		ani.runAction(cc.sequence(swap,
			cc.callFunc(function(){
				ani.destroy();
			})
		));
	},
	freshZaw(){
		if(this.zaw != null){
			this.zaw.stopAllActions();
			this.zaw.removeFromParent();
			this.zaw.destroy();
		}
		this.zaw = cc.instantiate(GlobalData.assets['zhangaiwus']);
		this.node.addChild(this.zaw);
		this.zaw.position = cc.v2(366,15);
		this.zaw.active = true;
		var stepNum = GlobalData.runTime.gameStep * GlobalData.cdnParam.stepNum;
		//添加五角星
		var iconX = -1;
		if(GlobalData.runTime.gameStep % GlobalData.cdnParam.xingNum == 0){
			iconX = Math.floor(Math.random() * this.zaw.children.length);
		}
		for(var i = 0;i < this.zaw.children.length;i++){
			let zaw1 = this.zaw.children[i];
			zaw1.active = true;
			var num = util.getRandomNum(stepNum);
			zaw1.getComponent('zhangaiwu').setNum(num);
			if(iconX != -1 && iconX == i){
				zaw1.getComponent('zhangaiwu').wuxing.active = true;
			}
			let xuxTypeRate = Math.random();
			if( xuxTypeRate <= GlobalData.cdnParam.wuxingRate.ups){
				zaw1.getComponent('zhangaiwu').wuxingType = 1;
			}else if(xuxTypeRate <= GlobalData.cdnParam.wuxingRate.power){
				zaw1.getComponent('zhangaiwu').wuxingType = 2;
			}else if(xuxTypeRate <= GlobalData.cdnParam.wuxingRate.shootNum){
				zaw1.getComponent('zhangaiwu').wuxingType = 3;
			}
		}
		
		//添加道具
		if(GlobalData.runTime.gameStep % GlobalData.cdnParam.propNum == 0){
			var prop = cc.instantiate(this.propIcon);
			if(Math.random() <= GlobalData.cdnParam.propRate){
				//ups
				GlobalData.runTime.propType = 1;
				prop.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['Ups'];
			}else{//power
				GlobalData.runTime.propType = 2;
				prop.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['Power'];
			}
			var size = this.zaw.getContentSize();
			var yy = Math.random() * size.height/2 * (Math.random() > 0.5 ? 1: -1);
			
			this.zaw.addChild(prop);
			prop.setPosition(cc.v2(GlobalData.ZhangAiWu[6],yy));
		}
		this.zaw.runAction(cc.repeatForever(cc.moveBy(0.01,cc.v2(-2,0))));
		this.flag = true;
		GlobalData.runTime.gameStep += 1;
	},
	tankeEnd(){
		if(this.gameTanke){
			this.gameTanke.getComponent('tanke').resumeDown();
		}
	},
	tankeJump(){
		if(this.gameTanke){
			this.gameTanke.getComponent('tanke').Jump();
		}
	},
    // use this for initialization
    onLoad: function () {
		console.log('onLoad');
		this.flag = false;
    },
	pauseGame(){
		this.zaw.stopAllActions();
		GlobalData.runTime.gameStatus = 2;
		if(this.gameTanke){
			this.gameTanke.getComponent('tanke').pauseGame();
		}
		this.touchOff();
	},
	reliveGame(){
		GlobalData.runTime.reliveFlag = 1;
		GlobalData.runTime.gameStatus = 1;
		if(this.gameTanke != null){
			this.gameTanke.removeFromParent();
			this.gameTanke.destroy();
		}
		this.freshZaw();
		this.gameTanke = cc.instantiate(GlobalData.assets['tanke']);
		this.node.addChild(this.gameTanke);
		this.gameTanke.position = cc.v2(-260,0);
		this.gameTanke.active = true;
		this.gameTanke.getComponent('tanke').startGame();
		this.node.on(cc.Node.EventType.TOUCH_START,this.tankeJump,this);
		this.node.on(cc.Node.EventType.TOUCH_END,this.tankeEnd,this);
		this.node.on(cc.Node.EventType.TOUCH_CANCLE,this.tankeEnd,this);
	},
	destroyGame(){
		GlobalData.runTime.gameStep = 1;
		GlobalData.runTime.curScore = 0;
		GlobalData.runTime.gameStatus = 0;
		if(GlobalData.buttles != null){
			GlobalData.buttles.clear()
		}
		this.zaw.stopAllActions();
		this.zaw.removeFromParent();
		this.zaw.destroy();
		this.touchOff();
	},
	touchOff(){
		this.node.off(cc.Node.EventType.TOUCH_START,this.tankeJump,this);
		this.node.off(cc.Node.EventType.TOUCH_END,this.tankeEnd,this);
		this.node.off(cc.Node.EventType.TOUCH_CANCLE,this.tankeEnd,this);
	},
    // called every frame
    update: function (dt) {
		var self = this;
		this.scoreNode.getComponent(cc.Label).string = GlobalData.runTime.curScore;
		if(this.flag == true && this.zaw.x <= -400 && GlobalData.runTime.gameStatus == 1){
			this.flag = false;
			setTimeout(function(){
				self.freshZaw();
			},500);
		}
    },
});
