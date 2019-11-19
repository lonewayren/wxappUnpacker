function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

function e(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i;
    }
    return Array.from(t);
}

var i = require("../../component/wxParse/wxParse.js"), n = require("../../service/column.js"), a = require("../../utils/index.js"), o = require("../../service/shareimg/index");

Page({
    data: {
        id: 0,
        data: {},
        content: {},
        comments: [],
        commentPage: {
            count: 0,
            more: !1
        },
        column: null,
        showActionSheet: !1,
        isReview: !1,
        isIOS: getApp().isIOS()
    },
    prevComment: 0,
    likeRequesting: !1,
    from: "",
    fromLogin: !1,
    onLoad: function(t) {
        var e = this;
        this.from = t.from;
        var i = 0;
        t.id ? i = Number(t.id) : t.scene && (i = Number(a.getQueryString("?" + decodeURIComponent(t.scene), "id"))), 
        i && (this.setData({
            id: i
        }), getApp().login().then(function() {
            e.requestData().then(function(t) {
                e.requestComments(), e.requestColumn();
            });
        }));
    },
    onShow: function() {
        var t = this;
        this.fromLogin && (this.fromLogin = !1, getApp().login().then(function() {
            t.requestData().then(function(e) {
                t.requestComments(), t.requestColumn();
            });
        }));
    },
    onHide: function() {},
    requestData: function() {
        var t = this;
        return new Promise(function(e, o) {
            n.getArticle(t.data.id).then(function(n) {
                n.article_ctime && (n.article_ctime_filter = a.formatDate(n.article_ctime)), n.audio_size_format = a.formatSize(n.audio_size), 
                n.video_media = {
                    hd: {
                        url: n.video_url
                    },
                    sd: {
                        url: n.video_url
                    }
                }, t.setData({
                    data: n
                });
                var o = a.formatContent(n.article_content), r = [], s = /\$\$?([^\$]+)\$\$?/g;
                (o = o.replace(/<\s*code[^>]*>([\s\S]*?)<\s*\/\s*code>/gi, function(t) {
                    return r.push(t), "___code___";
                })).search(s) > -1 && (o = (o = c + o).replace(s, function(t, e) {
                    return '<a href="' + e + '">数学公式</a>';
                })), o = o.replace(/___code___/gi, function() {
                    return r.shift();
                }), i.wxParse("content", o, t), wx.setNavigationBarTitle({
                    title: "" + n.article_title
                }), e(n);
            }).catch(function(t) {
                wx.showToast({
                    title: t.msg,
                    icon: "none"
                });
            });
        });
    },
    requestComments: function() {
        var t = this;
        n.getArticleComments(this.data.id, this.prevComment).then(function(i) {
            i.list = i.list.map(function(t) {
                return t.comment_content = a.formatHtml(t.comment_content), t.user_name_cut30 = a.cutStr(t.user_name, 30), 
                t.comment_ctime_format = a.formatDate(t.comment_ctime), t.replies && t.replies[0] && (t.replies[0].ctime_format = a.formatDate(t.replies[0].ctime), 
                t.replies[0].content = a.formatHtml(t.replies[0].content)), t;
            }), i.list.length && (t.prevComment = i.list[i.list.length - 1].score), t.setData({
                comments: [].concat(e(t.data.comments), e(i.list)),
                commentPage: i.page || {}
            });
        });
    },
    onReachBottom: function() {
        this.data.commentPage.more && this.requestComments();
    },
    requestColumn: function() {
        var t = this;
        this.data.data.cid && n.getColumnInfo(this.data.data.cid).then(function(e) {
            t.setData({
                column: e
            });
        });
    },
    onShareAppMessage: function(t) {
        var e = this.data.data.cid ? "/pages/articlepreview/articlepreview?id=" + this.data.data.id : "/pages/articlepro/articlepro?id=" + this.data.data.id;
        return {
            title: this.data.data.article_title + " | " + this.data.data.author_name,
            path: e,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    praiseArticle: function() {
        var e = this;
        if (!getApp().isLogin()) return this.gotoLogin();
        var i = this.data.data;
        this.likeRequesting || (this.likeRequesting = !0, i.had_liked ? n.unlikeArticle(i.id, "article").then(function(n) {
            var a;
            e.likeRequesting = !1, e.setData((a = {}, t(a, "data.like_count", i.like_count - 1), 
            t(a, "data.had_liked", !1), a));
        }).catch(function(t) {
            e.likeRequesting = !1, wx.showToast({
                title: t.msg,
                icon: "none"
            });
        }) : n.likeArticle(i.id, "article").then(function(n) {
            var a;
            e.likeRequesting = !1, e.setData((a = {}, t(a, "data.like_count", i.like_count + 1), 
            t(a, "data.had_liked", !0), a));
        }).catch(function(t) {
            e.likeRequesting = !1, wx.showToast({
                title: t.msg,
                icon: "none"
            });
        }));
    },
    commentJump: function() {
        getApp().isLogin() ? wx.navigateTo({
            url: "/pages/comment/comment?id=" + this.data.id + "&type=columnArticle"
        }) : getApp().navigateToLogin();
    },
    shareComment: function(t) {
        if (!getApp().isLogin()) return this.gotoLogin();
        var e = t.currentTarget.dataset.data;
        o.openComment("sharecomment", {
            content: e.comment_content,
            nicname: a.subString(e.user_name, 32),
            timestamp: e.comment_ctime,
            ctitle: this.data.column ? this.data.column.column_title : "",
            atitle: this.data.data.article_title,
            qrurl: "https://time.geekbang.org/column/article/" + this.data.data.id
        });
    },
    praiseComment: function(e) {
        var i = this;
        if (!getApp().isLogin()) return this.gotoLogin();
        var a = e.currentTarget.dataset.data;
        a.had_liked ? n.unlikeArticle(a.id, "comment").then(function(e) {
            i.data.comments.forEach(function(e, n) {
                if (e.id === a.id) {
                    var o;
                    i.setData((o = {}, t(o, "comments[" + n + "].like_count", i.data.comments[n].like_count - 1), 
                    t(o, "comments[" + n + "].had_liked", !1), o));
                }
            });
        }).catch(function(t) {
            wx.showToast({
                title: t.msg,
                icon: "none"
            });
        }) : n.likeArticle(a.id, "comment").then(function(e) {
            i.data.comments.forEach(function(e, n) {
                if (e.id === a.id) {
                    var o;
                    i.setData((o = {}, t(o, "comments[" + n + "].like_count", i.data.comments[n].like_count + 1), 
                    t(o, "comments[" + n + "].had_liked", !0), o));
                }
            });
        }).catch(function(t) {
            wx.showToast({
                title: t.msg,
                icon: "none"
            });
        });
    },
    popupShare: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    selectAction: function(t) {
        this.setData({
            showActionSheet: !1
        }), "shareMoment" === t.detail && (getApp().shareImage(this.data.data.article_poster_wxlite), 
        wx.navigateTo({
            url: "/pages/sharemoment/sharemoment"
        }));
    },
    gotoLogin: function() {
        this.fromLogin = !0, wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    subscribe: function() {
        "column" === this.from ? wx.navigateBack() : wx.navigateTo({
            url: "/pages/column/column?id=" + this.data.data.cid
        });
    },
    onReady: function() {},
    onUnload: function() {}
});

var c = "<p></p><blockquote>小程序不支持数学公式的显示，请在 App 内查看完整内容。</blockquote>";