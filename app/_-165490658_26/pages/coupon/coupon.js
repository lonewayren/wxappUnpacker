function t(t) {
    var e = "", a = "", o = 0;
    if (t && t.status) switch (o = t.status, Number(t.status)) {
      case 8:
        e = "active", a = "未开始";
        break;

      case 4:
        e = "disable", a = "已使用";
        break;

      case 16:
        e = "disable", a = "已过期";
        break;

      default:
        e = "", a = "";
    }
    return {
        code: o,
        classname: e,
        text: a
    };
}

var e = require("../../service/common.js"), a = require("../../utils/index.js");

Page({
    data: {
        type: "common",
        list: [],
        listDisable: [],
        showHistory: !1
    },
    refreshing: !1,
    onLoad: function(t) {
        t.type && this.setData({
            type: t.type
        }), "history" === t.type && wx.setNavigationBarTitle({
            title: "历史礼券"
        }), this.requestList();
    },
    requestList: function() {
        var o = this;
        this.refreshing || (this.refreshing = !0, e.getMyCoupon().then(function(e) {
            o.refreshing = !1, wx.stopPullDownRefresh(), e.usable = e.usable.map(function(e) {
                return e.amount_format = a.formatPrice(e.amount), e.start_time_format = a.formatDate(e.start_time, "."), 
                e.end_time_format = a.formatDate(e.end_time, "."), e.status = t(e), e;
            }), e.disabled = e.disabled.map(function(e) {
                return e.amount_format = a.formatPrice(e.amount), e.start_time_format = a.formatDate(e.start_time, "."), 
                e.end_time_format = a.formatDate(e.end_time, "."), e.status = t(e), e;
            }), o.setData({
                list: e.usable,
                listDisable: e.disabled,
                showHistory: e.disabled && e.disabled.length > 0
            });
        }).catch(function(t) {
            o.refreshing = !1, wx.stopPullDownRefresh(), a.error(t.msg);
        }));
    },
    jumpHistory: function() {
        wx.navigateTo({
            url: "/pages/coupon/coupon?type=history"
        });
    },
    jumpGetcoupon: function() {
        wx.navigateTo({
            url: "/pagesb/getcoupon/getcoupon"
        });
    },
    jumpRule: function() {
        wx.navigateTo({
            url: "/pages/couponrule/couponrule"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.requestList();
    }
});