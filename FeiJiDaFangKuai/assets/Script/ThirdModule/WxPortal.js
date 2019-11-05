// portal推荐位接入
var util = require('util');
let WxPortal = {
    portalAd:null,
	iconAd:null,
	bannerAd:null,

    createAd: function (type,cb) {
        if (typeof wx !== 'undefined') {
            var sysInfo = wx.getSystemInfoSync();
            console.log('sysinfo: ', sysInfo);
            if (sysInfo && sysInfo.SDKVersion && sysInfo.SDKVersion !== '' && sysInfo.SDKVersion.slice(0, 5).replace(/\./g, "") >= 275) {
				if (!GlobalData.cdnParam.refreshBanner) {
                    console.log('不刷新推荐位');
                    this.showBannerAd(type);
                    return;
                }
                //销毁banner广告
                this.destroyBannerAd(type);
				try {
					if(type == 2){
						// 创建banner推荐位实例，提前初始化
						if (wx.createGameBanner) {
							this.bannerAd = wx.createGameBanner({
								adUnitId: 'PBgAAtHnuk858WgI',
								style:{
									left:0,
									top: sysInfo.windowHeight
								}
							})
						}
						// 在适合的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.bannerAd) {
							this.bannerAd.show().catch((err) => {
								console.error(err)
								cb('error');
							})
						}
					}
					else if(type == 1){
						// 定义icon推荐位
						// 创建推荐位实例，提前初始化
						if (wx.createGameIcon) {
							this.iconAd = wx.createGameIcon({
								adUnitId: 'PBgAAtHnuk825clY',
								count:3,
								style:[
									{
										appNameHidden:0,
										color: "#ffffff",
										borderWidth:2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.3 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}, {
										appNameHidden: 0,
										color: "#ffffff",
										borderWidth: 2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.2 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}, {
										appNameHidden: 0,
										color: "#ffffff",
										borderWidth: 2,
										borderColor: "#ffea00",
										size: 30,
										top: 0.1 * sysInfo.windowHeight,
										left: 0.01 * sysInfo.windowWidth
									}
								]
							})
						}

						// 在合适的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.iconAd) {
							this.iconAd.load().then(() => {
								this.iconAd.show()
							}).catch((err) => {
								console.error(err)
								cb('error');
							})
						}
					}
					else if(type == 3){
						// 定义浮层推荐位
						// 创建推荐位实例，提前初始化
						if (wx.createGamePortal) {
							this.portalAd = wx.createGamePortal({
							adUnitId: 'PBgAAtHnuk8-zZcQ'
						  })
						}

						// 在适合的场景显示推荐位
						// err.errCode返回1004时表示当前没有适合推荐的内容，建议游戏做兼容，在返回该错误码时展示其他内容
						if (this.portalAd) {
							this.portalAd.load().then(() => {
								this.portalAd.show()
							}).catch((err) => {
								console.error(err)
								cb('error');
							})
						}
					}
				}catch (error) {
					console.log(error);
					cb('error');
				}
			}else {
				console.log('SDKVersion 判断基础库版本号 >= 2.7.5 后再使用该 API');
				cb('error');
			}
		}
    },
	hideAd(type){
		if(type == 1){
			if(this.iconAd != null){
				this.iconAd.hide();
			}
		}
		if(type == 2){
			if(this.bannerAd != null){
				this.bannerAd.hide();
			}
		}
		if(type == 3){
			if(this.portalAd != null){
				this.portalAd.hide();
			}
		}
	},
	showBannerAd: function (type) {
		if(type == 1){
			if(this.iconAd != null){
				this.iconAd.show();
			}
		}
		if(type == 2){
			if(this.bannerAd != null){
				this.bannerAd.show();
			}
		}
		if(type == 3){
			if(this.portalAd != null){
				this.portalAd.show();
			}
		}
    },
	destroyBannerAd(type){
		let ad = this.iconAd;
		if(type == 2){
			ad = this.bannerAd;
		}
		if(type == 3){
			ad = this.portalAd;
		}
		if (ad) {
			ad.hide();
            if (!GlobalData.cdnParam.refreshBanner) {
                return;
            }
            try {
                ad.destroy();
                ad = null;
            } catch (error) {
                ad = null;
            }
        }
	}
}

module.exports = WxPortal;