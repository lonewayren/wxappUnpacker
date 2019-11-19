var t = require("../../service/column.js"), e = require("../../utils/index.js"), a = require("../../component/wxParse/wxParse.js");

Page({
    data: {
        ready: !1,
        id: 0,
        data: {},
        content: {},
        showActionSheet: !1
    },
    onLoad: function(t) {
        var a, i = this;
        t.id && t.id > 0 ? a = Number(t.id) : t.scene && (a = Number(e.getQueryString("?" + decodeURIComponent(t.scene), "id"))), 
        a ? (this.setData({
            id: a
        }), getApp().login().then(function() {
            i.requestArticle(a);
        })) : e.error("无效的文章ID"), wx.setNavigationBarColor({
            backgroundColor: "#f0f0f0",
            frontColor: "#000000"
        });
    },
    requestArticle: function(i) {
        var n = this;
        i && t.getArticlePreview(i).then(function(t) {
            t.column_had_sub || t.article_could_preview ? wx.redirectTo({
                url: "/pages/articlepro/articlepro?id=" + t.id
            }) : (n.setData({
                ready: !0
            }), t.id && (a.wxParse("content", t.article_content_short, n), n.setData({
                data: t
            })));
        }).catch(function(t) {
            e.error(t.msg);
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
    columnJump: function() {
        wx.navigateTo({
            url: "/pages/column/column?id=" + this.data.data.cid
        });
    },
    onShareAppMessage: function(t) {
        return {
            title: this.data.data.article_title + " | " + this.data.data.author_name,
            path: "/pages/articlepreview/articlepreview?id=" + this.data.id,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});