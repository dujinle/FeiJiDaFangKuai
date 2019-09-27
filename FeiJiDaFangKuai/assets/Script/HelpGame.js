cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
		this.node.on(cc.Node.EventType.TOUCH_START,function(e){
			e.stopPropagation();
		})
	},
	onClose(){
		GlobalData.game.audioManager.getComponent('AudioManager').play(GlobalData.AudioManager.ButtonClick);
		this.node.active = false;
	}
});
