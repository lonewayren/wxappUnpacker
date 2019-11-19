function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, o = Array(t.length); e < t.length; e++) o[e] = t[e];
        return o;
    }
    return Array.from(t);
}

function e(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

var o = require("../../service/explore.js"), r = require("../../utils/index.js");

Page({
    data: {
        booksdata: [],
        page: {
            count: 0,
            score: "",
            more: !0
        },
        isIOS: getApp().isIOS()
    },
    block_list_id: "",
    onLoad: function(t) {
        this.block_list_id = t.id ? Number(t.id) : "", this.requestList(!0);
    },
    onReady: function() {},
    onShow: function() {},
    requestList: function(i) {
        var n = this, a = {
            block_id: this.block_list_id,
            pre: i ? 0 : this.data.page.score,
            size: 20
        };
        o.getBlockListData(a).then(function(o) {
            if (o.list.length > 0) {
                var a;
                n.setData((a = {}, e(a, "page.count", o.page.count), e(a, "page.more", o.page.more), 
                e(a, "page.score", o.list[o.list.length - 1].score), a));
            }
            var s = o.list.map(function(t, e, o) {
                return t.column_price_market = r.formatPrice(t.column_price_market), t;
            }), c = [].concat(t(n.data.booksdata), t(s));
            n.setData({
                booksdata: i ? s : c
            }), wx.stopPullDownRefresh();
        }).catch(function(t) {
            r.error(t.Msg), wx.stopPullDownRefresh();
        });
    },
    toinfopage: function(t) {
        var e = t.currentTarget.dataset.column, o = e.column_id, r = e.had_sub;
        wx.navigateTo({
            url: r ? "/pages/columnarticles/columnarticles?id=" + o : "/pages/column/column?id=" + o
        });
    },
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.requestList(!0);
    },
    onReachBottom: function() {
        this.data.page.more && this.requestList(!1);
    }
});