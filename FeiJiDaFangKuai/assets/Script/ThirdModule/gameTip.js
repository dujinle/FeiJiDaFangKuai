cc.Class({
    extends: cc.Component,

    properties: {
        f1:cc.Node,
		f2:cc.Node,
    },
	onShow(){
		this.node.active = true;
		var fa = cc.sequence(cc.fadeIn(0.2),cc.fadeOut(0.5));
		var fb = cc.sequence(cc.fadeOut(0.5),cc.fadeIn(0.2));
		this.f1.runAction(cc.repeat(fa,20));
		this.f2.runAction(cc.repeat(fb,20));
	},
	onClose(){
		this.f1.stopAllActions();
		this.f2.stopAllActions();
		this.node.active = false;
	}
});
