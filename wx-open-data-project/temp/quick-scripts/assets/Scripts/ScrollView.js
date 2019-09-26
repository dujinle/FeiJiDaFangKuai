(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ScrollView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1c8ba0SXO5DdY97ComdNJAJ', 'ScrollView', __filename);
// Scripts/ScrollView.js

"use strict";

cc.Class({
  extends: cc.Component,

  properties: {
    itemHeight: 60,
    firstItem: cc.Node,
    secondItem: cc.Node,
    thirdItem: cc.Node,
    commonItem: cc.Node,
    scrollView: {
      default: null,
      type: cc.ScrollView
    },
    spawnCount: 0, // 实际创建的项数量
    totalCount: 0, // 在列表中显示的项数量
    spacing: 0 // 项之间的间隔大小
  },
  onLoad: function onLoad() {
    this.spacing = 10;
  },

  // 列表初始化
  initialize: function initialize() {
    this.content = this.scrollView.content;
    this.items = []; // 存储实际创建的项数组
    this.updateTimer = 0;
    this.updateInterval = 0.2;
    this.itemHeight = 100;
    // 使用这个变量来判断滚动操作是向上还是向下
    this.lastContentPosY = 0;
    // 设定缓冲矩形的大小为实际创建项的高度累加，当某项超出缓冲矩形时，则更新该项的显示内容
    this.bufferZone = this.spawnCount * (this.itemHeight + this.spacing) / 2;
    // 获取整个列表的高度
    this.content.height = this.totalCount * (this.itemHeight + this.spacing) + this.spacing;
    for (var i = 0; i < this.spawnCount; ++i) {
      // spawn items, we only need to do this once
      var item = null;
      if (i == 0) {
        item = cc.instantiate(this.firstItem);
      } else if (i == 1) {
        item = cc.instantiate(this.secondItem);
      } else if (i == 2) {
        item = cc.instantiate(this.thirdItem);
      } else {
        item = cc.instantiate(this.commonItem);
      }

      this.content.addChild(item);
      // 设置该item的坐标（注意父节点content的Anchor坐标是(0.5, 1)，所以item的y坐标总是负值）
      item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
      item.getComponent("RankItem").setItem(i, this.data[i]);
      this.items.push(item);
    }
  },

  // 返回item在ScrollView空间的坐标值
  getPositionInView: function getPositionInView(item) {
    var worldPos = item.parent.convertToWorldSpaceAR(item.position);
    var viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
    return viewPos;
  },
  // 每帧调用一次。根据滚动位置动态更新item的坐标和显示(所以spawnCount可以比totalCount少很多)
  update: function update(dt) {
    this.updateTimer += dt;
    if (this.updateTimer < this.updateInterval) {
      return; // we don't need to do the math every frame
    }
    if (this.items == null || this.items.length <= 0) {
      return;
    }
    this.updateTimer = 0;
    var items = this.items;
    // 如果当前content的y坐标小于上次记录值，则代表往下滚动，否则往上。
    var isDown = this.scrollView.content.y < this.lastContentPosY;
    // 实际创建项占了多高（即它们的高度累加）
    var offset = (this.itemHeight + this.spacing) * items.length;
    var newY = 0;

    // 遍历数组，更新item的位置和显示
    for (var i = 0; i < items.length; ++i) {
      var viewPos = this.getPositionInView(items[i]);
      if (isDown) {
        // 提前计算出该item的新的y坐标
        newY = items[i].y + offset;
        // 如果往下滚动时item已经超出缓冲矩形，且newY未超出content上边界，
        // 则更新item的坐标（即上移了一个offset的位置），同时更新item的显示内容
        if (viewPos.y < -this.bufferZone && newY < 0) {
          items[i].y = newY;
          var item = items[i].getComponent('RankItem');
          var itemId = item.itemID - items.length; // update item id
          item.setItem(itemId, this.data[itemId]);
          cc.log("prev id:" + itemId);
        }
      } else {
        // 提前计算出该item的新的y坐标
        newY = items[i].y - offset;
        // 如果往上滚动时item已经超出缓冲矩形，且newY未超出content下边界，
        // 则更新item的坐标（即下移了一个offset的位置），同时更新item的显示内容
        if (viewPos.y > this.bufferZone && newY > -this.content.height) {
          items[i].y = newY;
          var _item = items[i].getComponent('RankItem');
          var _itemId = _item.itemID + items.length;
          _item.setItem(_itemId, this.data[_itemId]);
          cc.log("next id:" + _itemId);
        }
      }
    }

    // 更新lastContentPosY和总项数显示
    this.lastContentPosY = this.scrollView.content.y;
  },
  //获取服务器上的残局数据
  setInitData: function setInitData(data) {
    this.clear_scroll_data();
    this.data = data;
    this.totalCount = data.length;
    this.spawnCount = this.totalCount >= 14 ? 14 : this.totalCount;
    this.initialize();
  },
  clear_scroll_data: function clear_scroll_data() {
    if (this.items == null) {
      return;
    }
    this.scrollView.scrollToOffset(cc.v2(0, 0), 0.1);
    for (var i = 0; i < this.items.length; i++) {
      // spawn items, we only need to do this once
      var item = this.items[i];
      item.removeFromParent();
      item.destroy();
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
        //# sourceMappingURL=ScrollView.js.map
        