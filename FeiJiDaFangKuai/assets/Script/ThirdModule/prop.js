cc.Class({
    extends: cc.Component,

    properties: {
		collider:null,
    },
	onLoad(){
		this.collider = this.node.getComponent(cc.CircleCollider);
	},
    onCollisionEnter(other, self) {
		//撞到坦克了 播放动画
		if(other.tag == 2){
			this.collider.enabled = false;
			if(GlobalData.runTime.propType == 1){
				//增加子弹速度
				GlobalData.runTime.shootSpeed = GlobalData.runTime.shootSpeed - 0.05;
				if(GlobalData.runTime.shootSpeed <= 0){
					GlobalData.runTime.shootSpeed = 0.001;
				}
				GlobalData.runTime.buttleSpeed = GlobalData.runTime.buttleSpeed + 100;
			}else if(GlobalData.runTime.propType == 2){
				GlobalData.runTime.shootPowder = GlobalData.runTime.shootPowder + 1;
			}
			GlobalData.game.mainGame.getComponent('MainGame').showAnimate(GlobalData.runTime.propType,null);
			this.node.destroy();
		}
    },
});
