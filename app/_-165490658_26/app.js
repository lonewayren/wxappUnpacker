var e = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var i = arguments[t];
        for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
    }
    return e;
}, t = require("./utils/eventbus"), i = require("./service/user"), n = require("./service/common"), s = (require("./utils/index"), 
require("./service/audio"));

App({
    onLaunch: function() {
        if (wx.getUpdateManager) {
            var e = wx.getUpdateManager();
            e.onCheckForUpdate(function(t) {
                t.hasUpdate && e.onUpdateReady(function() {
                    wx.reportAnalytics("force_update", {}), setTimeout(function() {
                        return e.applyUpdate();
                    }, 400);
                });
            });
        }
        s.init(), i.getOpenId(), this.login(!0), this._checkReview(), wx.onNetworkStatusChange(function(e) {
            e.isConnected && "wifi" !== e.networkType && t.emit("NETWORK_CHANGE", {
                hasWifi: !1
            });
        }), this.systemInfo = wx.getSystemInfoSync() || {};
    },
    onShow: function(e) {
        this._checkReview(), this.options = e;
    },
    onError: function(e) {},
    _checkReview: function() {
        var e = this;
        n.checkReviewStatus().then(function(t) {
            e.appstatus.isReview = t && t.wxlite_ad, e.appstatus.pay = t && t.wxlite_ads && t.wxlite_ads.pay || 3;
            var i = t && t.wxlite_ads && t.wxlite_ads.groupbuy_poster || 1;
            e.appstatus.showGrouponPoster = 1 === Number(i);
        }).catch(function(e) {});
    },
    state: {
        loginUser: {
            nickname: "",
            avatar: "",
            uid: 0,
            cellphone: ""
        },
        cashier: {
            couponList: [],
            selectedCoupon: null,
            couldSelectCoupon: 0
        },
        shareImage: {
            image: ""
        }
    },
    _loginPromise: null,
    login: function() {
        var t = this;
        return !(arguments.length > 0 && void 0 !== arguments[0] && arguments[0]) && this._loginPromise ? this._loginPromise : (this._loginPromise = new Promise(function(n, s) {
            i.getLoginUser().then(function(i) {
                t.state.loginUser = e({}, t.state.loginUser, {
                    nickname: i.nick
                }, i), n(t.state.loginUser);
            }).catch(function(e) {
                t.state.loginUser.avatar = "", t.state.loginUser.nickname = "", n(t.state.loginUser);
            });
        }), this._loginPromise);
    },
    isLogin: function() {
        return !!this.state.loginUser.uid;
    },
    loginUser: function() {
        return this.state.loginUser;
    },
    navigateToLogin: function() {
        wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    updateLoginUser: function() {
        var t = this, i = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        i.uid || (i.uid = 0), this.state.loginUser = e({}, this.state.loginUser, {
            nickname: i.nick
        }, i), this._loginPromise = new Promise(function(e, i) {
            return e(t.state.loginUser);
        }), this.refreshExplorePageData = !0, this.refreshColumnsPageData = !0;
    },
    setCashier: function(e) {
        for (var t in e) this.state.cashier[t] = e[t];
    },
    getCashier: function() {
        return this.state.cashier;
    },
    clearCashier: function() {
        this.state.cashier = {
            couponList: [],
            selectedCoupon: null,
            couldSelectCoupon: 0
        };
    },
    shareImage: function(e) {
        return void 0 !== e && (this.state.shareImage.image = e), this.state.shareImage.image;
    },
    refreshExplorePageData: !1,
    refreshColumnsPageData: !1,
    willRefresh: function() {
        this.refreshExplorePageData = !0, this.refreshColumnsPageData = !0;
    },
    appstatus: {
        isReview: !1,
        pay: 3
    },
    noWifiTip: function(e) {
        wx.getStorageSync("NOMORE_WIFI_TIPS") ? e({
            tip: !1
        }) : wx.getNetworkType({
            success: function(t) {
                e && e({
                    tip: "wifi" !== t.networkType
                });
            },
            fail: function(t) {
                e && e({
                    tip: !1
                });
            }
        });
    },
    noMoreWifiTips: function() {
        wx.setStorageSync("NOMORE_WIFI_TIPS", !0);
    },
    options: {},
    systemInfo: {},
    isIOS: function() {
        return this.systemInfo.platform.toLowerCase().indexOf("ios") >= 0;
    }
});