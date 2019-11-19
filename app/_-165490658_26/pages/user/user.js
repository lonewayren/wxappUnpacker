function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, i = require("../../service/common.js");

Page({
    data: {
        loginUser: {},
        list: [ [ {
            icon: "icon-bought",
            field: "columns_count",
            color: "#ffc131",
            title: "已订阅",
            url: "/pages/mybought/mybought",
            auth: !0,
            ftText: "",
            display: !0
        }, {
            icon: "icon-quan",
            field: "valid_coupons_count",
            color: "#ff5a05",
            title: "礼券",
            url: "/pages/coupon/coupon",
            auth: !0,
            ftText: "",
            display: !0
        }, {
            icon: "icon-wallel",
            field: "",
            color: "#ff5a05",
            title: "分享有赏",
            url: "/pages/myreward/myreward",
            auth: !0,
            ftText: "",
            hideInReview: !0,
            display: !0
        }, {
            icon: "icon-friend",
            field: "",
            color: "#ff5a05",
            title: "邀请好友",
            url: "/pages/gkwebview/gkwebview?url=https://time.geekbang.org/activity/invite",
            auth: !0,
            ftText: "得30元",
            display: !0
        }, {
            icon: "icon-qiandai",
            field: "swell_coupon",
            color: "#ff5a05",
            title: "红包膨胀",
            url: "",
            auth: !0,
            ftText: "",
            display: !1
        } ], [ {
            icon: "icon-wodepintuan",
            field: "process_groupbuy_count",
            color: "#ff5a05",
            title: "我的拼团",
            url: "/pages/mygroupon/mygroupon",
            auth: !0,
            ftText: "",
            hideInReview: !0,
            display: !0
        }, {
            icon: "icon-message",
            field: "comments_count",
            color: "#64c8ff",
            title: "我的留言",
            url: "/pages/myComments/myComments",
            auth: !0,
            ftText: "",
            display: !0
        }, {
            icon: "icon-xin1",
            field: "likes_count",
            color: "#fe9b64",
            title: "我的收藏",
            url: "/pages/myLikes/myLikes",
            auth: !0,
            ftText: "",
            display: !0
        } ] ],
        isIOS: getApp().isIOS()
    },
    onShow: function() {
        this.setLoginUser(), this.setListData(), this.AdaptReview();
    },
    AdaptReview: function() {
        if (!getApp().appstatus.isReview) for (var e = 0; e < this.data.list.length; e++) for (var i = 0; i < this.data.list[e].length; i++) this.setData(t({}, "list[" + e + "][" + i + "].hideInReview", !1));
    },
    handleItemClick: function(t) {
        if (t.currentTarget.dataset.item.auth && !getApp().isLogin()) wx.navigateTo({
            url: "/pages/login/login"
        }); else {
            var e = t.currentTarget.dataset.item.url;
            wx.navigateTo({
                url: e
            });
        }
    },
    login: function() {
        wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    setLoginUser: function() {
        var t = this;
        getApp().login().then(function(e) {
            t.setData({
                loginUser: e
            });
        });
    },
    setListData: function() {
        var o = this;
        getApp().login().then(function(n) {
            getApp().isLogin() && i.getMyData().then(function(i) {
                for (var n = null, a = 0; a < o.data.list.length; a++) for (var l = 0; l < o.data.list[a].length; l++) void 0 !== i[(n = o.data.list[a][l]).field] && ("object" === e(i[n.field]) ? (i[n.field].desc && o.setData(t({}, "list[" + a + "][" + l + "].ftText", i[n.field].desc)), 
                "undefined" !== i[n.field].on && o.setData(t({}, "list[" + a + "][" + l + "].display", i[n.field].on)), 
                "undefined" !== i[n.field].url && o.setData(t({}, "list[" + a + "][" + l + "].url", "/pages/gkwebview/gkwebview?url=" + i[n.field].url + "&auth=true"))) : o.setData(t({}, "list[" + a + "][" + l + "].ftText", i[n.field])));
            }).catch(function(t) {});
        });
    },
    onLoad: function(t) {},
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {}
});