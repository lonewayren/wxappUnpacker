var e = require("../../utils/index.js");

Page({
    data: {
        url: ""
    },
    shareTitle: "",
    shareImg: "",
    shareUrl: "",
    onLoad: function(t) {
        if (t.url) {
            var i = decodeURIComponent(t.url);
            if (i.match(/https:\/\/(promo|time).geekbang.org/)) {
                if (i += "?", "false" === t.auth || (i += "ticket=" + e.getTicket() + "&deviceId=" + e.getDeviceId() + "&"), 
                Object.keys(t).length) for (var a in t) "url" !== a && "auth" !== a && (i += a + "=" + t[a] + "&");
                i = i.substr(0, i.length - 1), this.setData({
                    url: i
                });
            }
        }
    },
    onShow: function() {},
    onMessage: function(e) {
        for (var t = !1, i = !1, a = e.detail.data.length - 1; a >= 0; a--) {
            var r = e.detail.data[a];
            if (r && "share" === r.type) {
                if (t) continue;
                if (this.shareTitle = r.data.title, this.shareImg = r.data.img, this.shareUrl = r.data.link, 
                (t = !0) && i) break;
            }
            if (r && "login" === r.type) {
                if (i) continue;
                if (r.data.isLogin && getApp().login(!0), i = !0, t && i) break;
            }
        }
    },
    onShareAppMessage: function(e) {
        var t = {
            title: this.shareTitle || "极客时间",
            path: "/pages/gkwebview/gkwebview?url=" + (this.shareUrl ? encodeURIComponent(this.shareUrl) : encodeURIComponent(e.webViewUrl)),
            success: function(e) {},
            fail: function(e) {}
        };
        return this.shareImg && (t.imageUrl = this.shareImg), t;
    }
});