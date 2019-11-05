var WxChaAd = require('WxChaAd');
var WxPortal = require('WxPortal');
cc.Class({
    extends: cc.Component,

    properties: {
		gotoHomeButton:cc.Node,
		returnGame:cc.Node,
		bannerType:0,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	//继续游戏按钮回调
	onContinueCb(event){
		this.hidePause();
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.mainGame.getComponent('MainGame').continueGame();
	},
	//重新开始按钮回调
	onResetCb(event){
		this.hidePause();
		GlobalData.game.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.startGame.getComponent('StartGame').onShow();
		GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		GlobalData.game.mainGame.active = false;
	},
	showPause(){
		console.log("showPause game board show");
		var self = this;
		this.node.active = true;
		this.returnGame.getComponent(cc.Button).interactable = false;
		this.gotoHomeButton.getComponent(cc.Button).interactable = false;
		//添加广告位
		if(Math.random() > GlobalData.cdnParam.showADTJRate){
			this.bannerType = 0;
			WxChaAd.createChaAd(function(res){
				if(res == 'error'){
					self.returnGame.getComponent(cc.Button).interactable = true;
					self.gotoHomeButton.getComponent(cc.Button).interactable = true;
				}else if(res == 'close'){
					self.returnGame.getComponent(cc.Button).interactable = true;
					self.gotoHomeButton.getComponent(cc.Button).interactable = true;
				}
			});
		}else{
			this.bannerType = 1;
			WxPortal.createAd(3,(err)=>{
				if(err == 'error'){
					this.bannerType = 0;
					WxChaAd.createChaAd(function(res){
						if(res == 'error'){
							self.returnGame.getComponent(cc.Button).interactable = true;
							self.gotoHomeButton.getComponent(cc.Button).interactable = true;
						}else if(res == 'close'){
							self.returnGame.getComponent(cc.Button).interactable = true;
							self.gotoHomeButton.getComponent(cc.Button).interactable = true;
						}
					});
				}else if(err == 'close'){
					self.returnGame.getComponent(cc.Button).interactable = true;
					self.gotoHomeButton.getComponent(cc.Button).interactable = true;
				}
			});
		}
		
	},
	hidePause(){
		console.log("start game board hide");
		this.node.active = false;
	}
});