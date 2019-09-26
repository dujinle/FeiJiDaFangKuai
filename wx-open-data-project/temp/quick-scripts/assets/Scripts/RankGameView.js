(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/RankGameView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '21f7d//INBKD7J6aiWaUbHh', 'RankGameView', __filename);
// Scripts/RankGameView.js

"use strict";

cc.Class({
	extends: cc.Component,

	properties: {
		commonItem: cc.Node,
		viewScroll: cc.Node
	},
	loadRank: function loadRank(data) {
		//console.log(data);
		this.viewScroll.getComponent("ScrollView").setInitData(data);
		for (var i = 0; i < data.length; i++) {
			var dd = data[i];
			if (dd.my == true) {
				this.commonItem.getComponent("RankItem").loadRank(dd);
				break;
			}
		}
	}
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=RankGameView.js.map
        