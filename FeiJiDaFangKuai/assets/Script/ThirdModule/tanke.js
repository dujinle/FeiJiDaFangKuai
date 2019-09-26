cc.Class({
    extends: cc.Component,

    properties: {
		upSpeed:300,
		downSpeed:300,
		bullte:cc.Node,
		jumpFlag:false,
		sprite:cc.Node,
		particle:cc.ParticleSystem,
		collider:null,
    },
    onLoad () {
		this.bullte.active = false;
		this.collider = this.node.getComponent(cc.BoxCollider);
	},
	startGame(){
		this.node.active = true;
		this.schedule(this.moveDown,0.01);
		this.schedule(this.shoot,GlobalData.runTime.shootSpeed);
	},
	moveDown(dt){
		var self = this;
		this.node.y -= this.downSpeed * dt;
		if(this.node.y <= -358 || this.node.y >= 358){
			console.log('touch bottom');
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Bomb);
			this.collider.enabled = false;
			this.particle.resetSystem();
			this.unschedule(this.moveDown);
			this.unschedule(this.shoot);
			this.sprite.active = false;
			setTimeout(function(){
				GlobalData.game.finishGame.getComponent('FinishGame').show();
				if(self.node.isValid){
					self.node.destroy();
				}
			},500);
		}
	},
	resumeDown(){
		this.jumpFlag = false;
		this.schedule(this.moveDown,0.01);
	},
	Jump(){
		this.unschedule(this.moveDown);
		this.jumpFlag = true;
	},
	shoot(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Shoot);
		for(var i = 0;i < GlobalData.runTime.shootNum;i++){
			var buttle = cc.instantiate(this.bullte);
			var pos = this.node.getPosition();
			buttle.x =  pos.x + 50;
			buttle.y = pos.y;
			buttle.active = true;
			GlobalData.game.mainGame.addChild(buttle);
			buttle.getComponent('buttle').shoot(1 + i);
		}
	},
	onCollisionEnter(other, self) {
		var self = this;
		//于子弹碰撞跳过
		if(other.tag == 1){
			return;
		}
		//碰到障碍物 销毁
		if(other.tag == 3){
			this.collider.enabled = false;
			GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.Bomb);
			GlobalData.game.mainGame.getComponent('MainGame').touchOff();
			this.particle.resetSystem();
			this.unschedule(this.moveDown);
			this.unschedule(this.shoot);
			this.sprite.active = false;
			setTimeout(function(){
				GlobalData.game.finishGame.getComponent('FinishGame').show();
				if(self.node.isValid){
					self.node.destroy();
				}
			},500);
		}
    },
	update(dt){
		if(this.collider.enabled == false){
			return;
		}
		if(this.jumpFlag == false){
			return;
		}
		this.node.y += dt * this.upSpeed;
	}
});
