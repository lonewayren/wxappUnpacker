var n = require("../../service/user.js"), e = require("../../utils/index.js");

Page({
    data: {},
    optionsInfo: "",
    redirect: "",
    onLoad: function(n) {
        var e = "?";
        for (var i in n) e += i + "=" + n[i] + "&";
        this.optionsInfo = e.substr(0, e.length - 1), n.redirect && (this.redirect = decodeURIComponent(n.redirect));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    loginWithPhone: function() {
        wx.navigateTo({
            url: "/pages/loginphone/loginphone" + this.optionsInfo
        });
    },
    loginWithWx: function(i) {
        var o = this;
        i.detail.userInfo && (wx.showLoading({
            mask: !0
        }), n.wxUserInfo = i.detail.userInfo, n.loginByWx(i.detail).then(function(n) {
            if (wx.hideLoading(), e.success("登录成功！"), getApp().updateLoginUser(n), o.redirect) {
                o.redirect += "&userType=login", wx.navigateTo({
                    url: o.redirect
                });
            } else setTimeout(wx.navigateBack, 600);
        }).catch(function(n) {
            wx.hideLoading(), 3001 === n.code ? wx.navigateTo({
                url: "/pages/loginbind/loginbind" + o.optionsInfo
            }) : e.error(n.msg);
        }));
    }
});