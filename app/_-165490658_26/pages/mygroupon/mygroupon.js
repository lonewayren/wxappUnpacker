function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) n[e] = t[e];
        return n;
    }
    return Array.from(t);
}

function e(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

var n = require("../../service/common.js"), o = require("../../utils/index.js");

Page({
    data: {
        showIndex: "0",
        prev: 0,
        page: {
            more: !1
        },
        grouponingList: [],
        allList: [],
        isIOS: getApp().isIOS()
    },
    onLoad: function(t) {},
    onReady: function() {},
    getGrouping: function() {
        var t = this;
        n.getGroupingList().then(function(n) {
            n.list.forEach(function(t, e) {
                t.remainPer = t.groupbuy.success_ucount - t.groupbuy.join_ucount, t.startTime = o.formatDate(t.groupbuy.stime), 
                t.price = o.formatPrice(t.groupbuy.price);
            }), t.setData({
                grouponingList: n.list
            }), t.data.grouponingList.forEach(function(i, r) {
                i.r_time = 1e3 * (i.groupbuy.etime - n.time), t.setData(e({}, "grouponingList[" + r + "].remainingTime", i.r_time)), 
                o.setCountdown(i.r_time, function(n, o) {
                    i.timer = o, t.setData(e({}, "grouponingList[" + r + "].remainingTime", n));
                });
            });
        }).catch(function(t) {
            o.error(t.msg), wx.stopPullDownRefresh();
        });
    },
    getAllGrouponList: function(e) {
        var i = this;
        n.getAllGrouponList(0, e ? 0 : this.prev, 20).then(function(n) {
            wx.stopPullDownRefresh(), n.length && n.list.length && (i.prev = n.list[n.list.length - 1].score), 
            n.list.forEach(function(t, e) {
                t.remainPer = t.groupbuy.success_ucount - t.groupbuy.join_ucount, t.startTime = o.formatDate(t.groupbuy.stime, "."), 
                t.price = o.formatPrice(t.groupbuy.price);
            }), i.setData({
                allList: e ? n.list : [].concat(t(i.data.allList), t(n.list)),
                page: n.page
            });
        }).catch(function(t) {
            o.error(t.msg), wx.stopPullDownRefresh();
        });
    },
    switchtab: function(t) {
        this.setData({
            showIndex: t.target.dataset.index
        });
    },
    directTo: function(t) {
        var e = t.currentTarget.dataset.item.groupbuy.code;
        wx.navigateTo({
            url: "/pages/groupon/groupon?code=" + e
        });
    },
    onShow: function() {
        this.getGrouping(), this.getAllGrouponList(!0);
    },
    onHide: function() {
        this.data.grouponingList.forEach(function(t, e) {
            clearTimeout(t.timer);
        });
    },
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.page.more && this.getAllGrouponList(!1);
    }
});