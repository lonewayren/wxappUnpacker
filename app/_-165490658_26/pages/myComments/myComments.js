function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
    }
    return Array.from(e);
}

function t(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e;
}

var n = require("../../service/user.js"), r = require("../../utils/index.js"), a = require("../../service/shareimg/index");

Page({
    data: {
        page: {
            cursor: 0,
            hasMore: !0
        },
        commentsData: [],
        showLen: 80
    },
    onLoad: function(e) {},
    onReady: function() {},
    onShow: function() {
        this.requestList(!0);
    },
    requestList: function(a) {
        var o = this;
        n.getCommentsList(a ? 0 : this.data.page.cursor).then(function(n) {
            var i, c = n.list;
            if (o.setData((i = {}, t(i, "page.cursor", c[n.list.length - 1].score), t(i, "page.hasMore", n.page.more), 
            i)), c.length > 0) {
                var s = c.map(function(e, t, n) {
                    return e.comment_ctime_stamp = e.comment_ctime, e.comment_ctime = r.formatTime2(e.comment_ctime, {
                        hasDate: !0
                    }), e.comment_content = r.formatHtml(e.comment_content).trim(), e.replies && 0 !== e.replies.length && (e.replies[0].ctime = r.formatTime2(e.replies[0].ctime, {
                        hasDate: !0
                    }), e.replies[0].content = r.formatHtml(e.replies[0].content).trim()), e;
                }), m = a ? s : [].concat(e(o.data.commentsData), e(s));
                o.setData({
                    commentsData: m
                });
            }
            wx.stopPullDownRefresh();
        }).catch(function(e) {
            r.error(e.msg), wx.stopPullDownRefresh();
        });
    },
    jump: function(e) {
        console.log(e);
        var t = e.currentTarget.dataset.comments, n = t.cid, r = t.aid;
        "course" === t.source && n ? wx.navigateTo({
            url: "/pages/coursedetail/coursedetail?id=" + n + "&vid=" + r
        }) : wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + r
        });
    },
    del: function(e) {
        var t = this, a = e.currentTarget.dataset.comments.id, o = e.currentTarget.dataset.order;
        wx.showModal({
            content: "确定要删除该条留言么？",
            confirmText: "删除",
            cancelText: "取消",
            success: function(e) {
                if (e.confirm) n.delComment(a).then(function(e) {
                    r.success("删除成功");
                    var n = t.data.commentsData;
                    n.length > 0 && (n.map(function(e, t, n) {
                        return o === t && n.splice(t, 1), e;
                    }), t.setData({
                        commentsData: n
                    }));
                }).catch(function(e) {
                    r.error(e.msg);
                }); else if (e.cancel) return;
            }
        });
    },
    jumpDetail: function(e) {
        var t = e.currentTarget.dataset.content.id;
        wx.navigateTo({
            url: "/pages/myCommentsDetail/myCommentsDetail?id=" + t
        });
    },
    sharecomment: function(e) {
        var t = e.currentTarget.dataset.comments, n = t.comment_content, o = t.comment_ctime_stamp, i = t.column_title, c = t.article_title, s = "course" !== t.source ? "https://time.geekbang.org/column/article/" + t.aid : "https://time.geekbang.org/course/detail/" + t.cid + "-" + t.aid;
        a.openComment("sharecomment", {
            content: n,
            nicname: r.subString(getApp().state.loginUser.nickname, 32),
            timestamp: o,
            ctitle: i,
            atitle: c,
            qrurl: s
        });
    },
    onPullDownRefresh: function() {
        this.requestList(!0);
    },
    onReachBottom: function() {
        this.data.page.hasMore && this.requestList(!1);
    },
    onHide: function() {},
    onUnload: function() {}
});