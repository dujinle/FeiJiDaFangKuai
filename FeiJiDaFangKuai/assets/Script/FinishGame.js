var ThirdAPI = require('ThirdAPI');
var WxBannerAd = require('WxBannerAd');
var WxPortal = require('WxPortal');
cc.Class({
    extends: cc.Component,

    properties: {
		bannerType:0,//0 显示广告 1 显示推荐位
		rankSprite:cc.Node,
		isDraw:false,
		reStartSprite:cc.Node,
    },
	onLoad(){
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
		this.reStartSprite.active = false;
	},
	start(){
		try{
			this.texture = new cc.Texture2D();
			var openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = openDataContext.canvas;
		}catch(error){}
	},
	show(){
		console.log("finish game show");
		GlobalData.game.audioManager.getComponent('AudioManager').stopGameBg();
		this.reStartSprite.active = false;
		this.node.active = true;
		this.isDraw = true;
		var param = {
			type:'gameOverUIRank',
			game:1
		};
		ThirdAPI.getRank(param);
		this.reStartSprite.active = true;
		if(GlobalData.runTime.maxScore < GlobalData.runTime.curScore){
			GlobalData.runTime.maxScore = GlobalData.runTime.curScore
		}
		GlobalData.runTime.gameStatus = 0;
		GlobalData.gameConf.curScore += GlobalData.runTime.curScore;
		ThirdAPI.updataGameInfo();
		//添加广告位
		if(Math.random() > GlobalData.cdnParam.showADTJRate){
			this.bannerType = 0;
			WxBannerAd.createBannerAd();
		}else{
			this.bannerType = 1;
			WxPortal.createAd(2,(err)=>{
				if(err == 'error'){
					this.bannerType = 0;
					WxBannerAd.createBannerAd();
				}
			});
		}
	},
	rankButtonCb(){
		this.isDraw = false;
		if(this.bannerType == 0){
			WxBannerAd.hideBannerAd();
		}else{
			WxPortal.hideAd(2);
		}
		GlobalData.game.rankGame.getComponent('RankGame').show('finish',this.bannerType);
	},
	restartButtonCb(){
		GlobalData.game.audioManager.getComponent("AudioManager").play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.startGame.getComponent('StartGame').onShow();
		GlobalData.game.mainGame.getComponent('MainGame').destroyGame();
		GlobalData.game.mainGame.active = false;
		this.isDraw = false;
		this.node.active = false;
		if(this.bannerType == 0){
			WxBannerAd.destroyBannerAd();
		}else{
			WxPortal.destroyBannerAd(2);
		}
	},
	shareToFriends(){
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'分享你的战绩',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	shareSuccessCb(type, shareTicket, arg){
		console.log(type, shareTicket, arg);
		if(arg == 'Frestart'){
			GlobalData.GameInfoConfig.gameFailTimes = 3;
			this.restartButtonCb();
		}else if(arg == 'Fnext'){
			GlobalData.GameInfoConfig.gameFailTimes = 3;
			this.nextButtonCb();
		}
	},
	shareFailedCb(type,arg){
		console.log(type,arg);
		try{
			if(arg == 'Frestart'){
				var self = this;
				var content = '请分享到不同的群才可以开始游戏!';
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.restartButtonCb();
						}else if(res.cancel){}
					}
				});
			}else if(arg == 'Fnext'){
				var self = this;
				var content = '请分享到不同的群才可以开始游戏!';
				wx.showModal({
					title:'提示',
					content:content,
					cancelText:'取消',
					confirmText:'确定',
					confirmColor:'#53679c',
					success(res){
						if (res.confirm) {
							self.nextButtonCb();
						}else if(res.cancel){}
					}
				});
			}
		}catch(err){
			console.log(err);
		}
	},
	rankSuccessCb(){
		if(!this.texture){
			return;
		}
		this.texture.initWithElement(this.sharedCanvas);
		this.texture.handleLoadedTexture();
		this.rankSprite.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.texture);
	},
	update(){
		//console.log("update finish game");
		if(this.isDraw == true){
			this.rankSuccessCb();
		}
	}
});
