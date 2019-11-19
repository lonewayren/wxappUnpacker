Page({
    data: {
        loginUser: {},
        defaultAvatar: "https://static001.geekbang.org/resource/image/5e/85/5eb3386dea85a21b34f1a73d2c149885.png"
    },
    shareInfo: {},
    onLoad: function(n) {
        if (Object.keys(n).length) for (var e in n) this.shareInfo[e] = decodeURIComponent(n[e]);
        console.log("打印分享信息"), console.log(n), this.setLoginUser();
    },
    setLoginUser: function() {
        var n = this;
        getApp().login().then(function(e) {
            n.setData({
                loginUser: e
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var n = {
            title: this.shareInfo.title || "极客时间",
            path: "/pages/gkwebview/gkwebview?url=" + encodeURIComponent(this.shareInfo.link) + "&auth=false",
            success: function(n) {},
            fail: function(n) {}
        };
        return this.shareInfo.img && (n.imageUrl = this.shareInfo.img), n;
    },
    onPageScroll: function() {},
    onTabItemTap: function(n) {}
});