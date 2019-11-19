function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

function t(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var a = require("../../service/column"), r = require("../../utils/index.js");

Page({
    data: {
        column: {
            tab: 1,
            cut: [],
            all: [],
            page: {
                count: 0,
                more: !0,
                score: 0
            }
        },
        course: {
            tab: 2,
            cut: [],
            all: [],
            page: {
                count: 0,
                more: !0,
                score: 0
            }
        },
        vcourse: {
            tab: 3,
            cut: [],
            all: [],
            page: {
                count: 0,
                more: !0,
                score: 0
            }
        },
        others: {
            tab: 4,
            cut: [],
            all: [],
            page: {
                count: 0,
                more: !0,
                score: 0
            }
        },
        type: 0
    },
    nav_id: 0,
    tab_name: "all",
    onLoad: function(e) {
        this.getMyBoughtAll();
    },
    getMyBoughtAll: function() {
        var e = this;
        a.getMyBoughtAll().then(function(a) {
            wx.stopPullDownRefresh(), a.forEach(function(a, r, n) {
                if (1 === a.id) {
                    var o, s = a.list, i = a.page;
                    e.setData((o = {}, t(o, "column.cut", s.slice(0, 3)), t(o, "column.all", s), t(o, "column.page", a.page), 
                    t(o, "column.page.score", s && 0 !== s.length ? s[s.length - 1].extra.score : 0), 
                    t(o, "column.page.more", i.more), o));
                } else if (2 === a.id) {
                    var c, s = a.list, i = a.page;
                    e.setData((c = {}, t(c, "course.cut", s.slice(0, 3)), t(c, "course.all", s), t(c, "course.page", a.page), 
                    t(c, "course.page.score", s && 0 !== s.length ? s[s.length - 1].extra.score : 0), 
                    t(c, "course.page.more", i.more), c));
                } else if (3 === a.id) {
                    var l, s = a.list, i = a.page;
                    e.setData((l = {}, t(l, "vcourse.cut", s.slice(0, 3)), t(l, "vcourse.all", s), t(l, "vcourse.page", a.page), 
                    t(l, "vcourse.page.score", s && 0 !== s.length ? s[s.length - 1].extra.score : 0), 
                    t(l, "vcourse.page.more", i.more), l));
                } else {
                    var u, s = a.list, i = a.page;
                    e.setData((u = {}, t(u, "others.cut", s.slice(0, 3)), t(u, "others.all", s), t(u, "others.page", a.page), 
                    t(u, "others.page.score", s && 0 !== s.length ? s[s.length - 1].extra.score : 0), 
                    t(u, "others.page.more", i.more), u));
                }
            });
        }).catch(function(e) {
            wx.stopPullDownRefresh(), r.error(e.msg);
        });
    },
    getTabdata: function(n, o) {
        var s = this;
        a.getMyBoughtTabData(n, o, 10).then(function(a) {
            var r;
            wx.stopPullDownRefresh();
            var n = a.list, o = a.page, i = [].concat(e(s.data["" + s.tab_name].all), e(n));
            s.setData((r = {}, t(r, s.tab_name + ".all", i), t(r, s.tab_name + ".page.score", n && 0 !== n.length ? n[n.length - 1].extra.score : 0), 
            t(r, s.tab_name + ".page.more", o.more), r));
        }).catch(function(e) {
            wx.stopPullDownRefresh(), r.error(e.msg);
        });
    },
    switchType: function(e) {
        var t = Number(e.currentTarget.dataset.type);
        this.nav_id = 99 === t ? 99 : t, 1 === this.nav_id ? this.tab_name = "column" : 2 === this.nav_id ? this.tab_name = "course" : 3 === this.nav_id ? this.tab_name = "vcourse" : 99 === this.nav_id ? this.tab_name = "others" : this.tab_name = "all", 
        this.setData({
            type: t
        });
    },
    showAll: function(e) {
        var t = Number(e.currentTarget.dataset.item.tab);
        1 !== t && 2 !== t && 3 !== t && (t = 4), this.setData({
            type: t
        }), this.nav_id = 4 === t ? 99 : t, 1 === this.nav_id ? this.tab_name = "column" : 2 === this.nav_id ? this.tab_name = "course" : 3 === this.nav_id ? this.tab_name = "vcourse" : 99 === this.nav_id ? this.tab_name = "others" : this.tab_name = "all";
    },
    jump: function(e) {
        var t = Number(e.currentTarget.dataset.item.extra.column_type), a = Number(e.currentTarget.dataset.item.extra.column_id);
        3 === t || 6 === t ? wx.navigateTo({
            url: "/pages/courseintro/courseintro?id=" + a
        }) : wx.navigateTo({
            url: "/pages/columnarticles/columnarticles?id=" + a
        });
    },
    refreshTabData: function() {
        if ("all" !== this.tab_name && this.data["" + this.tab_name].page.more) {
            var e = this.data["" + this.tab_name].page.score;
            this.getTabdata(String("" + this.nav_id), e);
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        this.getMyBoughtAll();
    },
    onReachBottom: function() {
        this.refreshTabData();
    }
});