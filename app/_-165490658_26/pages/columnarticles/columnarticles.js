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

var i = require("../../service/column"), a = require("../../utils/index"), r = require("../../utils/eventbus"), o = require("../../service/audio");

Page({
    data: {
        id: 0,
        type: "",
        tabName: "article",
        order: {
            article: "newest",
            audio: "newest"
        },
        modeArticle: "img",
        data: {},
        articleList: [],
        articlePage: {
            count: 0,
            more: !1
        },
        audioList: [],
        audioPage: {
            count: 0,
            more: !1
        },
        curAudioHash: "",
        showActionSheet: !1,
        shareIconAnimate: !1
    },
    size: 20,
    prevArticle: 0,
    prevAudio: 0,
    articleLoading: !1,
    audioLoading: !1,
    audioPlayList: [],
    timer: null,
    onLoad: function(t) {
        var e = this;
        this.setData({
            id: t.id,
            type: t.trial ? "trial" : "common"
        }), getApp().login().then(function() {
            e.requestInfo(t.id).then(function(i) {
                var a = wx.getStorageSync("COLUMN_CONFIG_V1_" + i.id), r = {
                    order: {
                        article: 1 === Number(i.column_type) ? "newest" : "earliest",
                        audio: 1 === Number(i.column_type) ? "newest" : "earliest"
                    },
                    modeArticle: "img"
                };
                a && a.sortArticle && (r.order.article = a.sortArticle), a && a.sortAudio && (r.order.audio = a.sortAudio), 
                a && a.modeArticle && (r.modeArticle = a.modeArticle), e.setData(r), e.requestArticleList(t.id, !0), 
                e.requestAudioList(t.id, !0);
            });
        }), this._addEvent(), o.playing() && this.onAudioStart(o.curAudio());
    },
    requestInfo: function(t) {
        var e = this;
        return new Promise(function(r, o) {
            if (!t) return a.error("无效的ID");
            i.getColumnInfo(t).then(function(t) {
                return t.column_cover_inner_resize = t.column_cover_inner + "?x-oss-process=image/resize,w_750", 
                e.setData({
                    data: t
                }), wx.setNavigationBarTitle({
                    title: "" + t.column_title
                }), r(t);
            }).catch(function(t) {
                return a.error(t.msg);
            });
        });
    },
    requestArticleList: function(t, r) {
        var o = this;
        if (!t) return a.error("无效的ID");
        this.articleLoading || (this.articleLoading = !0, i.getArticles(t, r ? 0 : this.prevArticle, this.data.order.article, this.size).then(function(t) {
            o.articleLoading = !1, t.list = t.list.map(function(t) {
                return t.article_ctime_format = a.formatDate(t.article_ctime), t;
            }), o.setData({
                articleList: r ? t.list : [].concat(e(o.data.articleList), e(t.list)),
                articlePage: t.page
            }), t.list.length && (o.prevArticle = t.list[t.list.length - 1].score), wx.stopPullDownRefresh();
        }).catch(function(t) {
            o.articleLoading = !1, a.error(t.msg), wx.stopPullDownRefresh();
        }));
    },
    requestAudioList: function(t, r) {
        var o = this;
        if (!t) return a.error("无效的ID");
        this.audioLoading || (this.audioLoading = !0, i.getAudios(t, r ? 0 : this.prevAudio, this.data.order.audio, this.size).then(function(t) {
            o.audioLoading = !1, wx.stopPullDownRefresh(), t.list.length && (t.list = t.list.map(function(t) {
                return t.article_ctime_format = a.formatDate(t.article_ctime), t.audio_time_format = a.formatAudioTime(t.audio_time), 
                t.audio_size_format = a.formatSize(t.audio_size), t;
            }), o.setData({
                audioList: r ? t.list : [].concat(e(o.data.audioList), e(t.list)),
                audioPage: t.page
            }), o.audioPlayList = o.data.audioList.map(function(t) {
                return {
                    hash: t.audio_md5,
                    src: t.audio_download_url,
                    cover: o.data.data.column_cover,
                    bgcolor: o.data.data.column_bgcolor,
                    columnId: o.data.data.id,
                    title: t.article_title,
                    subTitle: t.author_name,
                    size: t.audio_size,
                    time: a.calTime(t.audio_time_arr),
                    id: t.id,
                    like_count: t.like_count,
                    had_liked: t.had_liked,
                    shareImg: t.article_poster_wxlite
                };
            }), o.prevAudio = t.list[t.list.length - 1].score);
        }).catch(function(t) {
            o.audioLoading = !1, a.error(t.msg), wx.stopPullDownRefresh();
        }));
    },
    switchTab: function(t) {
        this.setData({
            tabName: t.currentTarget.dataset.tab
        });
    },
    switchOrderBy: function() {
        this.setData(t({}, "order." + this.data.tabName, "newest" === this.data.order[this.data.tabName] ? "earliest" : "newest")), 
        this.saveConfig(), "article" === this.data.tabName ? this.requestArticleList(this.data.id, !0) : this.requestAudioList(this.data.id, !0);
    },
    introJump: function(t) {
        var e = t.currentTarget.dataset.column.id;
        wx.navigateTo({
            url: "/pages/column/column?id=" + e
        });
    },
    jump: function(e) {
        var i = e.currentTarget.dataset.index;
        this.setData(t({}, "articleList[" + i + "].had_viewed", !0));
        var a = e.currentTarget.dataset.article.id;
        wx.navigateTo({
            url: "../articlepro/articlepro?id=" + a
        });
    },
    playAudio: function(t) {
        var e = t.currentTarget.dataset;
        o.play(this.audioPlayList, e.index), wx.navigateTo({
            url: "/pages/vplayer/vplayer"
        });
    },
    changeShowParten: function() {
        this.setData({
            modeArticle: "img" === this.data.modeArticle ? "list" : "img"
        }), this.saveConfig();
    },
    onReachBottom: function() {
        "article" === this.data.tabName ? this.data.articlePage.more && this.requestArticleList(this.data.id) : this.data.audioPage.more && this.requestAudioList(this.data.id);
    },
    onShareAppMessage: function(t) {
        var e = this;
        return {
            title: "" + this.data.data.column_share_title,
            path: "/pages/column/column?id=" + this.data.data.id,
            success: function(t) {
                wx.reportAnalytics("foward_column_success", {
                    column_id: e.data.data.id,
                    column_name: e.data.data.column_title
                });
            },
            fail: function(t) {}
        };
    },
    _addEvent: function() {
        var t = this;
        this.onAudioStart = function(e) {
            return t.setData({
                curAudioHash: e.hash || ""
            });
        }, r.on("AUDIO_START", this.onAudioStart);
    },
    _removeEvent: function() {
        r.remove("AUDIO_START", this.onAudioStart);
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        this.timer = setTimeout(function() {
            t.setData({
                shareIconAnimate: !0
            });
        }, 2e3);
    },
    onHide: function() {
        this.timer && clearTimeout(this.timer), this.setData({
            shareIconAnimate: !1
        });
    },
    onUnload: function() {
        this._removeEvent();
    },
    onPullDownRefresh: function() {
        "article" === this.data.tabName ? this.requestArticleList(this.data.id, !0) : this.requestAudioList(this.data.id, !0);
    },
    popupShare: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    selectAction: function(t) {
        this.setData({
            showActionSheet: !1
        }), "shareMoment" === t.detail && (getApp().shareImage(this.data.data.column_poster_wxlite), 
        wx.navigateTo({
            url: "/pages/sharemoment/sharemoment"
        }));
    },
    saveConfig: function() {
        wx.setStorage({
            key: "COLUMN_CONFIG_V1_" + this.data.data.id,
            data: {
                sortArticle: this.data.order.article,
                sortAudio: this.data.order.audio,
                modeArticle: this.data.modeArticle
            }
        });
    }
});