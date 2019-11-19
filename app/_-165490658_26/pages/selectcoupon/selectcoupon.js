var t = require("../../utils/index.js");

Page({
    data: {
        unuse: !1,
        couponList: [],
        couldSelectCoupon: 0,
        selectedCoupon: null
    },
    onLoad: function(e) {
        var o = getApp().getCashier();
        o.couponList = o.couponList.map(function(e) {
            return e.amount_format = t.formatPrice(e.amount), e.start_time_format = t.formatDate(e.start_time, "."), 
            e.end_time_format = t.formatDate(e.end_time, "."), e;
        }), this.setData({
            couponList: o.couponList,
            couldSelectCoupon: o.couldSelectCoupon,
            selectedCoupon: o.selectedCoupon
        });
    },
    select: function(t) {
        var e = Number(t.currentTarget.dataset.index);
        (-1 === Number(e) || this.data.couponList[e].could_selected) && (getApp().setCashier({
            selectedCoupon: e
        }), this.setData({
            selectedCoupon: e
        }), wx.navigateBack());
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {}
});