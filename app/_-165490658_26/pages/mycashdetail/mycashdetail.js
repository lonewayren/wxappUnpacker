function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i;
    }
    return Array.from(t);
}

var e = require("../../service/cash"), i = require("../../utils/index");

Page({
    data: {
        list: [],
        page: {
            more: !1
        }
    },
    loading: !1,
    prev: 0,
    onLoad: function(t) {
        this.getDetail(!0);
    },
    getDetail: function(n) {
        var o = this;
        this.loading || (this.loading = !0, e.getDetail(20, n ? 0 : this.prev).then(function(e) {
            wx.stopPullDownRefresh(), o.loading = !1, e.list.length && (o.prev = e.list[e.list.length - 1].score), 
            e.list = e.list.map(function(t) {
                return t.time_format_date = i.formatDate(t.time), t.time_format_time = i.formatTime(t.time), 
                t.amount_format = i.formatPrice(t.amount, 2), t;
            }), o.setData({
                list: n ? e.list : [].concat(t(o.data.list), t(e.list)),
                page: e.page
            });
        }).catch(function(t) {
            wx.stopPullDownRefresh(), o.loading = !1, i.error(t.msg);
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.getDetail(!0);
    },
    onReachBottom: function() {
        this.data.page.more || this.getDetail();
    }
});