(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/FinishGameRank.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4b762SIRG5MH6Vx82JIm+ng', 'FinishGameRank', __filename);
// Scripts/FinishGameRank.js

"use strict";

cc.Class({
	extends: cc.Component,

	properties: {
		rankNodes: {
			type: cc.Node,
			default: []
		}
	},
	loadRank: function loadRank(data) {
		//console.log(data);
		for (var i = 0; i < data.length; i++) {
			var dd = data[i];
			var itemNode = this.rankNodes[i];
			itemNode.getChildByName("rankLabel").getComponent(cc.Label).string = dd.rank;
			itemNode.getChildByName("nameLabel").getComponent(cc.Label).string = dd.nickname;
			itemNode.getChildByName("scoreLabel").getComponent(cc.Label).string = 0;
			for (var j = 0; j < dd.KVDataList.length; j++) {
				var kvdata = dd.KVDataList[j];
				if (kvdata.key == "maxScore") {
					itemNode.getChildByName("scoreLabel").getComponent(cc.Label).string = kvdata.value;
				}
			}
			if (dd.my == true) {
				itemNode.getChildByName("scoreLabel").color = new cc.color("#ba5a55");
				itemNode.getChildByName("rankLabel").color = new cc.color("#ba5a55");
				itemNode.getChildByName("nameLabel").color = new cc.color("#ba5a55");
			}
			this.loadImage(itemNode, dd.avatarUrl);
		}
	},
	loadImage: function loadImage(node, url) {
		if (url == null || url.length == 0) {
			return;
		}
		cc.loader.load({ url: url, type: 'png' }, function (err, tex) {
			//console.log("loadImage",url,node);
			node.getChildByName("avatarSprite").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex);
		});
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
        //# sourceMappingURL=FinishGameRank.js.map
        