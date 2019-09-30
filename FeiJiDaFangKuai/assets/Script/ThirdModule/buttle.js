cc.Class({
    extends: cc.Component,

    properties: {
		particle:cc.ParticleSystem,
		type:1,
		sprite:cc.Node,
		collider:null,
    },
	onLoad(){
		this.collider = this.node.getComponent(cc.CircleCollider);
	},
	shoot(type){
		this.collider.enabled = true;
		this.particle.stopSystem();
		this.sprite.active = true;
		this.type = type;
	},
    onCollisionEnter(other, self) {
		if(this.node == null){
			return;
		}
		//撞到坦克了 跳过
		if(other.tag == 2){
			return;
		}
		//撞到障碍物了 播放动画
		if(other.tag == 3){
			this.collider.enabled = false;
			this.particle.resetSystem();
			this.sprite.active = false;
			setTimeout(()=>{
				GlobalData.buttles.put(this.node);
			},500);
		}
    },

    update (dt) {
		if(this.collider.enabled == false){
			return;
		}
		if(this.type == 1){
			this.node.x += GlobalData.runTime.buttleSpeed * dt;
		}else if(this.type == 2){
			this.node.x += GlobalData.runTime.buttleSpeed * dt;
			this.node.y -= GlobalData.runTime.buttleSpeed * dt;
		}else if(this.type == 3){
			this.node.x += GlobalData.runTime.buttleSpeed * dt;
			this.node.y += GlobalData.runTime.buttleSpeed * dt;
		}
		if(this.node.x >= 300){
			this.collider.enabled = false;
			GlobalData.buttles.put(this.node);
		}
	},
});
