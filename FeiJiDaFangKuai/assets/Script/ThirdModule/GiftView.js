var WxVideoAd = require('WxVideoAd');
var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
        openSprite:cc.Node,
		propSprite:cc.Node,
		cancleLabel:cc.Node,
		openType:null,
		propType:null,
    },
    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
		this.cancleLabel.runAction(cc.fadeOut());
	},
	show(propType,openType){
		//按钮图标设置
		if(openType == 'DJShare'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share'];
		}else if(openType == 'DJAV'){
			this.openSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['share_video'];
		}
		this.openType = openType;
		//道具图标设置
		if(propType == 1){//ups
			this.propSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['Ups'];
		}else if(propType == 2){//powers
			this.propSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['Power'];
		}else if(propType == 3){//sandan
			this.propSprite.getComponent(cc.Sprite).spriteFrame = GlobalData.assets['Sandan'];
		}
		this.propType = propType;
		this.propSprite.runAction(cc.repeat(cc.sequence(cc.scaleTo(0.8, 0.5),cc.scaleTo(0.8, 1)),20));
		setTimeout(()=>{
			this.cancleLabel.active = true;
		},2000);
	},
	quXiaoBtnCB(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		this.node.removeFromParent();
		this.node.destroy();
		GlobalData.game.mainGame.getComponent('MainGame').continueGame();
	},
	getPropBtn(event){
		if(event != null){
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
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
				this.node.removeFromParent();
				this.node.destroy();
				GlobalData.game.mainGame.getComponent('MainGame').updateProp(this.propType);
				GlobalData.game.mainGame.getComponent('MainGame').continueGame();
			};
			this.DJAVFalseCallFunc = function(arg){
				if(arg == 'cancle'){
					this.showFailInfo();
				}else if(arg == 'error'){
					this.openType = "DJShare";
					this.getPropBtn();
				}
			};
			WxVideoAd.installVideo(this.DJAVTrueCallFunc.bind(this),this.DJAVFalseCallFunc.bind(this),null);
		}
	},
	shareSuccessCb(type, fenXiangZhen, arg){
		if(this.flagCBFunc == false){
			this.node.removeFromParent();
			this.node.destroy();
			GlobalData.game.mainGame.getComponent('MainGame').updateProp(this.propType);
			GlobalData.game.mainGame.getComponent('MainGame').continueGame();
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
						self.getPropBtn();
					}else if(res.cancel){
					}
				}
			});
		}catch(err){}
	}
});
