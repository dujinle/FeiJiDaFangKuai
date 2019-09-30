var ThirdAPI = require('ThirdAPI');
var WxVideoAd = require('WxVideoAd');
cc.Class({
    extends: cc.Component,

    properties: {
		processBar:cc.Node,
		numLabel:cc.Node,
		cancleLabel:cc.Node,
		openSprite:cc.Node,
		rate:10,
		loadUpdate:null,
		openType:null,
		cbFunc:null,
    },
    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			console.log('touch continueNow');
			e.stopPropagation();
		})
		this.numLabel.getComponent(cc.Label).string = 10;
		this.processBar.getComponent(cc.ProgressBar).progress = 1;
		this.cancleLabel.runAction(cc.fadeOut());
	},
	continueNow(event){
		if(event != null){
			this.unschedule(this.loadUpdate);
		}
		this.flagCBFunc = false;
		if(this.openType == "DJShare"){
			var param = {
				type:null,
				arg:null,
				successCallback:this.shareSuccessCb.bind(this),
				failCallback:this.shareFailedCb.bind(this),
				shareName:this.openType,
				isWait:true
			};
			if(GlobalData.cdnParam.shareType == 0){
				param.isWait = false;
			}
			ThirdAPI.shareGame(param);
		}else if(this.openType == "DJAV"){
			this.DJAVTrueCallFunc = function(arg){
				this.node.active = false;
				GlobalData.game.mainGame.getComponent('MainGame').reliveGame();
			};
			this.DJAVFalseCallFunc = function(arg){
				if(arg == 'cancle'){
					this.showFailInfo();
				}else if(arg == 'error'){
					this.openType = "DJShare";
					this.continueNow(null);
				}
			};
			WxVideoAd.installVideo(this.DJAVTrueCallFunc.bind(this),this.DJAVFalseCallFunc.bind(this),null);
		}
	},
	quXiaoBtnCB(){
		this.node.active = false;
		GlobalData.game.finishGame.getComponent('FinishGame').show();
	},
	shareSuccessCb(type, fenXiangZhen, arg){
		if(this.flagCBFunc == false){
			this.node.active = false;
			GlobalData.game.mainGame.getComponent('MainGame').reliveGame();
		}
		this.flagCBFunc = true;
	},
	shareFailedCb(type,arg){
		if(this.flagCBFunc == false && this.node.active == true){
			this.showFailInfo();
		}
		this.flagCBFunc = true;
	},
	showFailInfo(){
		try{
			var self = this;
			var content = GlobalData.msgBox.DJShareContent;
			if(this.openType == 'DJAV'){
				content = GlobalData.msgBox.DJAVContent;
			}
			wx.showModal({
				title:'提示',
				content:content,
				cancelText:'取消',
				confirmText:'确定',
				confirmColor:'#53679c',
				success(res){
					if (res.confirm) {
						self.continueNow(null);
					}else if(res.cancel){
						self.schedule(self.loadUpdate,1);
					}
				}
			});
		}catch(err){}
	},
	waitCallBack(prop){
		var self = this;
		this.node.active = true;
		this.openType = prop;
		if(this.openType == 'DJShare'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
		}else if(this.openType == 'DJAV'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share_video'];
		}
		this.loadUpdate = function(){
			self.rate = self.rate - 1;
			self.numLabel.getComponent(cc.Label).string = self.rate;
			var scale = self.rate/10;
			self.processBar.getComponent(cc.ProgressBar).progress = scale;
			if(self.rate <= 0){
				self.unschedule(self.loadUpdate);
				self.node.active = false;
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			}
		};
		this.schedule(this.loadUpdate,1);
		this.cancleLabel.runAction(cc.sequence(cc.delayTime(1),cc.fadeIn()));
	}
});