cc.Class({
    extends: cc.Component,

    properties: {
		upInitSpeed:150,
		downInitSpeed:150,
		jumpFlag:false,
		sprite:cc.Node,
		touchFlag:0, //1, 上部 2,下部
		jumpTime:0,
		particle:cc.ParticleSystem,
		collider:null,
    },
    onLoad () {
		this.jumpTime = 0;
		this.collider = this.node.getComponent(cc.BoxCollider);
		var rate = (GlobalData.gameConf.propUps + GlobalData.gameConf.propPower - 1) * 10;
		this.downSpeed = this.downInitSpeed + rate;
		this.upSpeed = this.upInitSpeed + rate;
		this.size = this.node.getContentSize();
		this.touchFlag = 0;
	},
	startGame(){
		this.manager = cc.director.getCollisionManager();
		if(GlobalData.buttles == null){
			GlobalData.buttles = new cc.NodePool();
		}
		this.touchFlag = 0;
		this.node.active = true;
		var rate = (GlobalData.gameConf.propUps + GlobalData.gameConf.propPower - 1) * 10;
		this.downSpeed = this.downInitSpeed + rate;
		this.upSpeed = this.upInitSpeed + rate;
		this.schedule(this.moveDown,0.01);
		this.schedule(this.shoot,GlobalData.runTime.shootSpeed);
		console.log(this.downSpeed,this.upSpeed);
	},
	pauseDown(flag){
		if(flag == false){
			this.unschedule(this.moveDown);
		}else{
			this.schedule(this.moveDown,0.01);
		}
	},
	pauseGame(){
		if(this.node != null){
			this.unschedule(this.moveDown);
			this.jumpFlag = false;
			this.unschedule(this.shoot);
		}
	},
	moveDown(dt){
		//这里有可能已经销毁node了
		if(this.node == null){
			return;
		}
		//碰到了下部了不可以下降了
		if(this.touchFlag == 2){
			return;
		}
		this.node.y -= this.downSpeed * dt;
		if(this.node.y <= -358 || this.node.y >= 358){
			console.log('touch bottom');
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Bomb);
			this.collider.enabled = false;
			this.particle.resetSystem();
			this.unschedule(this.moveDown);
			this.unschedule(this.shoot);
			this.sprite.active = false;
			setTimeout(()=>{
				this.reliveGame();
			},500);
		}
	},
	reliveGame(){
		if(this.node == null){
			return;
		}
		if(GlobalData.runTime.gameStatus != 1){
			return;
		}
		GlobalData.game.mainGame.getComponent('MainGame').pauseGame();
		if(GlobalData.runTime.jushu >= GlobalData.cdnParam.reliveConf.lock && GlobalData.runTime.reliveFlag == 0){
			if(Math.random() <= GlobalData.cdnParam.reliveConf.rate){
				if(Math.random() <= GlobalData.cdnParam.videoRate){
					GlobalData.game.fuhuoGame.getComponent('ReliveGame').waitCallBack('DJAV');
				}else{
					GlobalData.game.fuhuoGame.getComponent('ReliveGame').waitCallBack('DJShare');
				}
			}else{
				GlobalData.game.finishGame.getComponent('FinishGame').show();
			}
		}else{
			GlobalData.game.finishGame.getComponent('FinishGame').show();
		}
		this.node.destroy();
	},
	resumeDown(){
		this.jumpFlag = false;
		this.schedule(this.moveDown,0.01);
	},
	Jump(){
		this.jumpTime = 0;
		this.unschedule(this.moveDown);
		this.jumpFlag = true;
	},
	shoot(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Shoot);
		for(var i = 0;i < GlobalData.runTime.shootNum;i++){
			var buttle = null;
			if(GlobalData.buttles.size() > 0){
				buttle = GlobalData.buttles.get();
			}else{
				buttle = cc.instantiate(GlobalData.assets['buttle']);
			}
			var pos = this.node.getPosition();
			buttle.x =  pos.x + 50;
			buttle.y = pos.y;
			buttle.active = true;
			GlobalData.game.mainGame.addChild(buttle);
			buttle.getComponent('buttle').shoot(1 + i);
		}
	},
	onCollisionEnter(other, self) {
		//这里有可能已经销毁node了
		if(this.node == null){
			return;
		}
		//于子弹碰撞跳过
		if(other.tag == 1){
			return;
		}
		//碰到障碍物 上部
		if(other.tag == 3 && self.tag == 2){
			this.touchFlag = 1;
		}
		//碰到障碍物 下部
		if(other.tag == 3 && self.tag == 5){
			this.touchFlag = 2;
		}
		//碰到障碍物 销毁
		if(other.tag == 3 && self.tag == 4){
			this.collider.enabled = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Bomb);
			GlobalData.game.mainGame.getComponent('MainGame').touchOff();
			this.particle.resetSystem();
			this.unschedule(this.moveDown);
			this.unschedule(this.shoot);
			this.sprite.active = false;
			setTimeout(()=>{
				this.reliveGame();
			},500);
		}
		
    },
	onCollisionExit(other,self){
		//碰到障碍物 上部
		if(other.tag == 3 && self.tag == 2){
			this.touchFlag = 0;
		}
		//碰到障碍物 下部
		if(other.tag == 3 && self.tag == 5){
			this.touchFlag = 0;
		}
	},
	update(dt){
		if(this.collider.enabled == false){
			return;
		}
		if(this.jumpFlag == false){
			return;
		}
		//碰到了上部了不可以上升了
		if(this.touchFlag == 1){
			return;
		}
		this.jumpTime += dt;
		if(this.jumpTime >= 1){
			this.node.y += dt * (this.jumpTime * this.upSpeed);
		}else{
			this.node.y += dt * this.upSpeed;
		}
	}
});
