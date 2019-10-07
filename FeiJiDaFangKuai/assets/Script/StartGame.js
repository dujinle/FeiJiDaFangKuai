var ThirdAPI = require('ThirdAPI');
cc.Class({
    extends: cc.Component,

    properties: {
		soundOnNode:cc.Node,
		soundOffNode:cc.Node,
		scoreLabel:cc.Node,
		helpNode:cc.Node,
		upLabel:cc.Node,
		upLevel:cc.Node,
		upBtn:cc.Node,
		powerLabel:cc.Node,
		powerLevel:cc.Node,
		powerBtn:cc.Node,
		startBtn:cc.Node,
    },

    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		});
	},
	onShow(){
		this.node.active = true;
		this.helpNode.active = false;
		if(GlobalData.runTime.audioSupport == 1){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
		}else{
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
		this.scoreLabel.getComponent(cc.Label).string = GlobalData.gameConf.curScore;
		this.initProp();
	},
	initProp(){
		this.upLevel.getComponent(cc.Label).string = GlobalData.gameConf.propUps;
		this.powerLevel.getComponent(cc.Label).string = GlobalData.gameConf.propPower;
		this.upLabel.getComponent(cc.Label).string = GlobalData.gameConf.propUps * 190;
		this.powerLabel.getComponent(cc.Label).string = GlobalData.gameConf.propPower * 190;
		if(GlobalData.gameConf.curScore >= GlobalData.gameConf.propPower * 190){
			this.powerBtn.getComponent(cc.Button).interactable = true;
		}else{
			this.powerBtn.getComponent(cc.Button).interactable = false;
		}
		if(GlobalData.gameConf.curScore >= GlobalData.gameConf.propUps * 190){
			this.upBtn.getComponent(cc.Button).interactable = true;
		}else{
			this.upBtn.getComponent(cc.Button).interactable = false;
		}
	},
	upAdd(){
		GlobalData.gameConf.curScore -= GlobalData.gameConf.propUps * 190;
		GlobalData.gameConf.propUps += 1;
		this.initProp();
	},
	powerAdd(){
		GlobalData.gameConf.curScore -= GlobalData.gameConf.propPower * 190;
		GlobalData.gameConf.propPower += 1;
		this.initProp();
	},
	helpShow(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.helpGame.active = true;
	},
    startButtonCb(event){
		this.node.active = false;
		GlobalData.runTime.jushu += 1;
		GlobalData.runTime.gameStep = 1;
		GlobalData.runTime.curScore = 0;
		GlobalData.runTime.gameStatus = 1;
		GlobalData.runTime.reliveFlag = 0;
		GlobalData.runTime.shootNum = GlobalData.gameConf.shootNum;
		GlobalData.runTime.shootSpeed = GlobalData.gameConf.shootSpeed - ((GlobalData.gameConf.propUps -1) * 0.05);
		GlobalData.runTime.buttleSpeed = GlobalData.gameConf.buttleSpeed + ((GlobalData.gameConf.propUps - 1)* 100);
		GlobalData.runTime.shootPowder = GlobalData.gameConf.shootPowder + (GlobalData.gameConf.propPower - 1);
		
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.mainGame.active = true;
		GlobalData.game.mainGame.getComponent('MainGame').initGame();
	},
	soundButtonCb(){
		if(GlobalData.runTime.audioSupport == 0){
			this.soundOnNode.active = true;
			this.soundOffNode.active = false;
			GlobalData.runTime.audioSupport = 1;
		}else{
			GlobalData.runTime.audioSupport = 0;
			this.soundOnNode.active = false;
			this.soundOffNode.active = true;
		}
	},
    shareButtonCb(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		var param = {
			type:null,
			arg:null,
			successCallback:this.shareSuccessCb.bind(this),
			failCallback:this.shareFailedCb.bind(this),
			shareName:'share',
			isWait:false
		};
		ThirdAPI.shareGame(param);
	},
	rankButtonCb(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		GlobalData.game.rankGame.getComponent('RankGame').show();
	},
	shareSuccessCb(type, shareTicket, arg){
		if(arg == 'budaoStart'){
			this.node.active = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
			GlobalData.game.mainBuDaoGame.getComponent('MainBuDaoGame').initGame();
		}
	},
	shareFailedCb(type,arg){
		try{
			if(arg == 'budaoStart'){
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
							self.bdButtonCb();
						}else if(res.cancel){}
					}
				});
			}
		}catch(err){
			console.log(err);
		}
	},
    update (dt) {
		this.scoreLabel.getComponent(cc.Label).string = GlobalData.gameConf.curScore;
	},
});
