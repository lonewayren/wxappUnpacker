function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

var e = require("../../service/audio"), i = require("../../utils/eventbus"), a = require("../../utils/index"), r = require("../../service/column");

Page({
    data: {
        player: {},
        playList: [],
        curIndex: 0,
        curTimeFormat: "00:00",
        progressOffset: 0,
        progressDotOffset: 0,
        progressWidth: 250,
        playing: !1,
        showPlayList: !1
    },
    name: "vplayer",
    sliding: !1,
    likeRequesting: !1,
    onLoad: function(t) {},
    onUnload: function() {},
    onShow: function() {
        var t = e.curAudio(), i = e.curTime();
        this.setData({
            player: t,
            playList: e.playList(),
            playing: e.playing(),
            curTimeFormat: a.formatAudioTime(i, "sec"),
            progressOffset: i / t.time * this.data.progressWidth,
            progressDotOffset: i / t.time * this.data.progressWidth,
            curIndex: e.curIndex()
        }), this.setTitle(), this.data.player.hash || wx.hideShareMenu(), this.updatePraise(), 
        this._addEvent();
    },
    onHide: function() {
        this._removeEvent();
    },
    _addEvent: function() {
        var t = this;
        this.onAudioStart = function(i, a) {
            t.setData({
                player: e.curAudio(),
                playing: !0,
                curIndex: e.curIndex()
            }), t.setTitle();
        }, this.onAudioPause = function(e) {
            t.setData({
                playing: !1
            }), t.setTitle();
        }, this.onAudioError = function(e) {
            t.setData({
                playing: !1
            }), t.setTitle();
        }, this.onAudioEnded = function(e) {
            t.setData({
                playing: !1
            });
        }, this.onTimeUpdate = function(e) {
            !t.sliding && e.currentTime && e.totalTime && t.setData({
                curTimeFormat: a.formatAudioTime(e.currentTime, "sec"),
                progressOffset: e.currentTime / e.totalTime * t.data.progressWidth,
                progressDotOffset: e.currentTime / e.totalTime * t.data.progressWidth
            });
        }, i.on("AUDIO_START", this.onAudioStart), i.on("AUDIO_PAUSE", this.onAudioPause), 
        i.on("AUDIO_ERROR", this.onAudioError), i.on("AUDIO_ENDED", this.onAudioEnded), 
        i.on("AUDIO_TIME_UPDATE", this.onTimeUpdate);
    },
    _removeEvent: function() {
        i.remove("AUDIO_START", this.onAudioStart), i.remove("AUDIO_PAUSE", this.onAudioPause), 
        i.remove("AUDIO_ERROR", this.onAudioError), i.remove("AUDIO_ENDED", this.onAudioEnded), 
        i.remove("AUDIO_TIME_UPDATE", this.onTimeUpdate);
    },
    togglePlay: function() {
        this.data.player.hash && (this.data.playing ? (this.setData({
            playing: !1
        }), e.pause()) : (this.setData({
            playing: !0
        }), e.play()));
    },
    prev: function() {
        this.data.player.hash && e.prev();
    },
    next: function() {
        this.data.player.hash && e.next();
    },
    selectAudio: function(t) {
        var i = t.currentTarget.dataset;
        e.select(i.index);
    },
    jumpArticle: function() {
        this.data.player.id && wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + this.data.player.id
        });
    },
    jumpColumn: function() {
        this.data.player.columnId && wx.navigateTo({
            url: "/pages/column/column?id=" + this.data.player.columnId
        });
    },
    praiseArticle: function() {
        var e = this;
        if (this.data.player.hash) {
            if (!getApp().isLogin()) return getApp().navigateToLogin();
            var i = this.data.player;
            this.likeRequesting || (this.likeRequesting = !0, i.had_liked ? r.unlikeArticle(i.id, "article").then(function(a) {
                var r;
                e.likeRequesting = !1, e.setData((r = {}, t(r, "player.like_count", i.like_count - 1), 
                t(r, "player.had_liked", !1), r));
            }).catch(function(t) {
                e.likeRequesting = !1, a.error(t.msg);
            }) : r.likeArticle(i.id, "article").then(function(a) {
                var r;
                e.likeRequesting = !1, e.setData((r = {}, t(r, "player.like_count", i.like_count + 1), 
                t(r, "player.had_liked", !0), r));
            }).catch(function(t) {
                e.likeRequesting = !1, a.error(t.msg);
            }));
        }
    },
    showPlayList: function() {
        this.data.player.hash && this.setData({
            showPlayList: !0
        });
    },
    hidePlayList: function() {
        this.setData({
            showPlayList: !1
        });
    },
    setTitle: function() {
        getCurrentPages() && "vplayer" !== getCurrentPages()[getCurrentPages().length - 1].name || (wx.setNavigationBarTitle({
            title: this.data.playing ? "正在播放" + (this.data.curIndex + 1) + "/" + this.data.playList.length : "已暂停"
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: this.data.player.bgcolor || "#c3aa9c"
        }));
    },
    onShareAppMessage: function() {
        return {
            title: "" + this.data.player.title,
            path: "/pages/articlepreview/articlepreview?id=" + this.data.player.id,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    onSlideChange: function(t) {
        if (this.sliding) {
            var e = t.detail.x / this.data.progressWidth * this.data.player.time;
            this.setData({
                curTimeFormat: a.formatAudioTime(e, "sec"),
                progressOffset: t.detail.x
            });
        }
    },
    onSlideBegin: function(t) {
        this.sliding = !0;
    },
    onSlideOver: function(t) {
        var i = this;
        setTimeout(function() {
            return i.sliding = !1;
        }, 200), e.seek(Math.floor(this.data.progressOffset / this.data.progressWidth * this.data.player.time));
    },
    updatePraise: function() {
        var e = this;
        this.data.player.id && r.getArticle(this.data.player.id).then(function(i) {
            var a;
            e.setData((a = {}, t(a, "player.had_liked", i.had_liked), t(a, "player.like_count", i.like_count), 
            a));
        }).catch(function(t) {});
    }
});