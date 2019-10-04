cc.Class({
    extends: cc.Component,

    properties: {
		particles:{
			type:cc.ParticleSystem,
			default:null
		},
		numLabel:cc.Node,
		sprite:cc.Node,
		target:0,
		wuxingType:1,
		wuxing:cc.Node,
		collider:null,
    },
	setNum(num){
		this.target = num;
		this.wuxing.active = false;
		this.numLabel.getComponent(cc.Label).string = num;
	},
    onLoad () {
		this.target = 0;
		this.wuxing.active = false;
		this.collider = this.node.getComponent(cc.BoxCollider);
	},
	onCollisionEnter(other, self) {
		if(other.tag == self.tag){
			return;
		}
		//子弹射击
		if(other.tag == 1){
			if(this.target >= GlobalData.runTime.shootPowder){
				this.target -= GlobalData.runTime.shootPowder;
				GlobalData.runTime.curScore += GlobalData.runTime.shootPowder;
			}else{
				GlobalData.runTime.curScore += this.target;
				this.target = 0;
			}
			
			if(this.target > 0){
				this.numLabel.getComponent(cc.Label).string = this.target;
			}else{
				if(this.wuxing.active == true){
					this.wuxing.active = false;
					if(this.wuxingType == 1){//ups
						//增加子弹速度
						GlobalData.runTime.shootSpeed = GlobalData.runTime.shootSpeed - 0.05;
						GlobalData.runTime.buttleSpeed = GlobalData.runTime.buttleSpeed + 100;
						setTimeout(function(){
							GlobalData.runTime.shootSpeed = GlobalData.runTime.shootSpeed + 0.05;
							GlobalData.runTime.buttleSpeed = GlobalData.runTime.buttleSpeed - 100;
						},10000);
					}else if(this.wuxingType == 2){//power
						GlobalData.runTime.shootPowder = GlobalData.runTime.shootPowder + 1;
						setTimeout(function(){
							GlobalData.runTime.shootPowder = GlobalData.runTime.shootPowder - 1;
						},10000);
					}else if(this.wuxingType == 3){//shootNum
						GlobalData.runTime.shootNum = 3;
						setTimeout(function(){
							GlobalData.runTime.shootNum = 1;
						},10000);
					}
				}
				this.collider.enabled = false;
				this.sprite.active = false;
				this.numLabel.active = false;
				var skin = GlobalData.ParticleConf[GlobalData.runTime.particleSkin % GlobalData.ParticleConf.length];
				//console.log(skin,GlobalData.assets[skin]);
				this.particles.spriteFrame = GlobalData.assets[skin];
				this.particles.resetSystem();
				GlobalData.runTime.particleSkin += 1;
				setTimeout(()=>{
					this.node.destroy();
				},500);
			}
		}
    }
});
