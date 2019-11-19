function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, r = Array(t.length); e < t.length; e++) r[e] = t[e];
        return r;
    }
    return Array.from(t);
}

function e(t, e, r) {
    return e in t ? Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = r, t;
}

var r = require("../../service/user.js"), a = require("../../utils/index.js");

Page({
    data: {
        likesData: [],
        page: {
            cursor: 0,
            hasMore: !0
        }
    },
    onLoad: function(t) {
        this.requestList(!0);
    },
    onReady: function() {},
    onShow: function() {},
    requestList: function(i) {
        var n = this, o = {
            size: 20,
            prev: i ? 0 : this.data.page.cursor
        };
        r.getMyLikesList(o).then(function(r) {
            var o = r.list.map(function(t, e, r) {
                return t.article_title = a.subString(t.article_title, 36), t.column_title = a.subString(t.column_title, 28), 
                t.author_name = a.subString(t.author_name, 20), t;
            });
            if (o.length > 0) {
                var s;
                n.setData((s = {}, e(s, "page.cursor", r.list[r.list.length - 1].score), e(s, "page.hasMore", r.page.more), 
                s));
            }
            var u = [].concat(t(n.data.likesData), t(o));
            n.setData({
                likesData: i ? o : u
            }), wx.stopPullDownRefresh();
        }).catch(function(t) {
            a.error(t.msg), wx.stopPullDownRefresh();
        });
    },
    jump: function(t) {
        var e = t.currentTarget.dataset.artical, r = e.cid, a = e.id;
        "course" === e.source && r ? wx.navigateTo({
            url: "/pages/coursedetail/coursedetail?id=" + r + "&vid=" + a
        }) : wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + a
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.requestList(!0);
    },
    onReachBottom: function() {
        this.data.page.hasMore && this.requestList(!1);
    }
});