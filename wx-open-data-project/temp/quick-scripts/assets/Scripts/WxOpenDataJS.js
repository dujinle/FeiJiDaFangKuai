(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/WxOpenDataJS.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4874dn6l+pDyq8ZeEXOiKD3', 'WxOpenDataJS', __filename);
// Scripts/WxOpenDataJS.js

'use strict';

cc.Class({
	extends: cc.Component,

	properties: {
		finishGameRank: cc.Node,
		rankGmameView: cc.Node,
		aboveGameView: cc.Node
	},
	onLoad: function onLoad() {
		this.setViewVisiable(null);
	},
	start: function start() {
		var _this = this;

		wx.onMessage(function (data) {
			_this.setViewVisiable(null);
			switch (data.type) {
				case 'gameOverUIRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore', 'maxLevel'], // 你要获取的、托管在微信后台都key
						success: function success(res) {
							//console.log(res.data);
							//排序
							_this.setViewVisiable(data.type);
							var rankList = _this.sortRank(res.data);
							_this.drawRankOverList(rankList, data);
						}
					});

					break;
				case 'rankUIFriendRank':
					wx.getFriendCloudStorage({
						keyList: ['maxScore', 'maxLevel'], // 你要获取的、托管在微信后台都key
						success: function success(res) {
							//console.log(res.data);
							//排序
							_this.setViewVisiable(data.type);
							var rankList = _this.sortRank(res.data);
							_this.drawRankFrientList(rankList, data);
						}
					});
					break;
				case 'rankUIGroupRank':
					wx.getGroupCloudStorage({
						shareTicket: data.shareTicket,
						keyList: ['maxScore', 'maxLevel'], // 你要获取的、托管在微信后台都key
						success: function success(res) {
							//console.log(res.data);
							//排序
							_this.setViewVisiable(data.type);
							var rankList = _this.sortRank(res.data);
							_this.drawRankFrientList(rankList, data);
						}
					});
					break;
				case 'initFriendRank':
					_this.setViewVisiable(data.type);
					_this.initRankFriendCloudStorage(data);
					break;
				case 'battleUIRank':
					_this.setViewVisiable(data.type);
					_this.drawRankList(_this.rankList, data);
					break;
			}
		});
	},
	initRankFriendCloudStorage: function initRankFriendCloudStorage(data) {
		var _this2 = this;

		this.rankList = null;
		this.battleInit = false;
		this.myRankData = null;
		wx.getFriendCloudStorage({
			keyList: ['maxScore', 'maxLevel'], // 你要获取的、托管在微信后台都key
			success: function success(res) {
				//console.log(res.data);
				var dataList = res.data;
				wx.getUserInfo({
					openIdList: ['selfOpenId'],
					lang: 'zh_CN',
					success: function success(res) {
						console.log('getUserInfo success', res.data);
						for (var i = 0; i < dataList.length; i++) {
							var item = dataList[i];
							item.rank = i + 1;
							item.my = false;
							if (item.nickname == res.data[0].nickName) {
								item.my = true;
								_this2.myRankData = item;
							}
						}
						_this2.rankList = _this2.sortRank(dataList);
						_this2.battleInit = true;
						var data = { type: 'battleUIRank', score: 0 };
						_this2.setViewVisiable(data.type);
						_this2.drawRankList(_this2.rankList, data);
					},
					fail: function fail(res) {
						//console.log('getUserInfo reject', res.data)
						reject(res);
						//data.name = '我';
						//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
						//this.drawSelfRank(data.KVDataList);
					}
				});
			}
		});
	},
	setViewVisiable: function setViewVisiable(type) {
		this.finishGameRank.active = false;
		this.rankGmameView.active = false;
		this.aboveGameView.active = false;
		if (type == 'battleUIRank') {
			this.aboveGameView.active = true;
		} else if (type == 'rankUIGroupRank') {
			this.rankGmameView.active = true;
		} else if (type == 'rankUIFriendRank') {
			this.rankGmameView.active = true;
		} else if (type == 'gameOverUIRank') {
			this.finishGameRank.active = true;
		}
	},
	drawRankOverList: function drawRankOverList(dataList, data) {
		var _this3 = this;

		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: function success(res) {
				console.log('getUserInfo success', res.data);
				var preData = null;
				var drawList = [];
				var findSelf = false;
				for (var i = 0; i < dataList.length; i++) {
					var item = dataList[i];
					item.rank = i + 1;
					item.my = false;
					if (item.nickname == res.data[0].nickName) {
						item.my = true;
						if (preData != null) {
							drawList.push(preData);
						}
						drawList.push(item);
						findSelf = true;
						continue;
					}
					if (findSelf == true) {
						if (drawList.length <= 2) {
							drawList.push(item);
						}
					}
					//找到三个 如果有了就结束循环
					if (drawList.length >= 3) {
						break;
					}
					preData = item;
				}
				_this3.drawRankList(drawList, data);
			},
			fail: function fail(res) {
				//console.log('getUserInfo reject', res.data)
				reject(res);
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		});
	},
	drawRankFrientList: function drawRankFrientList(rankList, data) {
		var _this4 = this;

		wx.getUserInfo({
			openIdList: ['selfOpenId'],
			lang: 'zh_CN',
			success: function success(res) {
				console.log('getUserInfo success', res.data);
				for (var i = 0; i < rankList.length; i++) {
					var item = rankList[i];
					item.rank = i + 1;
					item.my = false;
					if (item.nickname == res.data[0].nickName) {
						item.my = true;
					}
				}
				_this4.drawRankList(rankList, data);
			},
			fail: function fail(res) {
				//console.log('getUserInfo reject', res.data)
				reject(res);
				//data.name = '我';
				//data.avatarUrl = 'res/raw-assets/resources/textures/fireSprite.png';
				//this.drawSelfRank(data.KVDataList);
			}
		});
	},
	drawRankList: function drawRankList(drawList, data) {
		console.log('drawRankList', drawList, data);
		if (data.type == "gameOverUIRank") {
			this.finishGameRank.getComponent("FinishGameRank").loadRank(drawList);
		} else if (data.type == "rankUIFriendRank" || data.type == "rankUIGroupRank") {
			this.rankGmameView.getComponent("RankGameView").loadRank(drawList);
		} else if (data.type == 'battleUIRank') {
			if (this.battleInit == true) {
				this.aboveGameView.getComponent("AboveGameView").loadRank(drawList, this.myRankData, data.score);
			}
		}
	},
	sortRank: function sortRank(data) {
		return data.sort(this.sortFunction);
	},
	sortFunction: function sortFunction(a, b) {
		var amaxScore = 0;
		var bmaxScore = 0;
		for (var i = 0; i < a.KVDataList.length; i++) {
			var aitem = a.KVDataList[i];
			//console.log(aitem);
			if (aitem.key == "maxScore") {
				amaxScore = parseInt(aitem.value);
			}
		}
		for (var i = 0; i < b.KVDataList.length; i++) {
			var bitem = b.KVDataList[i];
			//console.log(bitem);
			if (bitem.key == "maxScore") {
				bmaxScore = parseInt(bitem.value);
			}
		}
		return bmaxScore - amaxScore;
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
        //# sourceMappingURL=WxOpenDataJS.js.map
        