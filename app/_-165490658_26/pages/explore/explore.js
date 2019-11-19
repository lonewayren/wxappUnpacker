function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, i = Array(e.length); t < e.length; t++) i[t] = e[t];
        return i;
    }
    return Array.from(e);
}

var t = require("../../service/explore.js"), i = require("../../utils/index.js"), o = require("../../service/audio.js");

Page({
    data: {
        columns: [],
        current: 0,
        isIOS: getApp().isIOS()
    },
    time: 0,
    block_list_id: "",
    audioIconCheckTimer: null,
    onLoad: function(e) {
        this.requestData(), this.time = +new Date();
    },
    requestData: function() {
        var o = this;
        getApp().login().then(function() {
            t.getExplore().then(function(t) {
                var n = [], a = [];
                t && (t.forEach(function(t, r) {
                    if ("wxlite_promo_topic" === t.block_name && 0 !== t.list.length) {
                        var c = t.list.map(function(e, t, i) {
                            return e.card_type = "topic", e;
                        });
                        n = [].concat(e(n), e(c));
                    }
                    if ("wxlite_promo_limit" === t.block_name && 0 !== t.list.length) {
                        var l = t.list.map(function(e, t, i) {
                            return e.card_type = "comment", e;
                        });
                        o.data.isIOS && (l = l.filter(function(e) {
                            return !(e.redirect_url && String(e.redirect_url).indexOf("time.geekbang.org/activity/wxlite/groupbuylist") >= 0);
                        })), n = [].concat(e(n), e(l));
                    }
                    if (!getApp().appstatus.isReview && "wxlite_book" === t.block_name && 0 !== t.list.length) {
                        o.block_list_id = t.block_id;
                        var u = t.list.map(function(e, t, o) {
                            return e.column_price_market = i.formatPrice(e.column_price_market), e.card_type = "book", 
                            e;
                        });
                        t.list[0].had_sub ? a.push(t.list[0]) : n = [].concat(e(n), e(u));
                    }
                    if ("wxlite_column_on" === t.block_name && 0 !== t.list.length) {
                        var s = t.list.map(function(e, t, i) {
                            return e.card_type = "col", e;
                        });
                        n = [].concat(e(n), e(s));
                    }
                    if ("wxlite_explore_column" === t.block_name && 0 !== t.list.length) {
                        var p = t.list.map(function(e, t, i) {
                            return e.card_type = "article", e;
                        });
                        n = [].concat(e(n), e(p));
                    }
                }), 0 === a.length ? o.setData({
                    columns: n
                }) : (n = [].concat(e(n), a), o.setData({
                    columns: n
                })));
            }).catch(function(e) {
                i.error(e.msg);
            });
        });
    },
    toInfoPage: function(e) {
        var t = e.currentTarget.dataset.column, i = t.article_id, o = t.column_id, n = t.had_sub || !1, a = t.column_type, r = t.card_type;
        if ("topic" === r) wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + i
        }); else if ("comment" === r) {
            var c = t.source_type, l = t.redirect_url || "", u = l ? encodeURIComponent("" + l) : "";
            1 === c && i ? wx.navigateTo({
                url: "/pages/articlepro/articlepro?id=" + i
            }) : 2 === c && l && wx.navigateTo({
                url: "/pages/gkwebview/gkwebview?url=" + u
            });
        } else "book" === r ? wx.navigateTo({
            url: n ? "/pages/columnarticles/columnarticles?id=" + o : "/pages/column/column?id=" + o
        }) : "col" === r ? a && 1 === a ? wx.navigateTo({
            url: n ? "/pages/columnarticles/columnarticles?id=" + o : "/pages/column/column?id=" + o
        }) : a && 3 === a && wx.navigateTo({
            url: "/pages/courseintro/courseintro?id=" + o
        }) : "article" === r && wx.navigateTo({
            url: n ? "/pages/columnarticles/columnarticles?id=" + o : "/pages/column/column?id=" + o
        });
    },
    jumpExplorebook: function() {
        wx.navigateTo({
            url: "/pages/explorebook/explorebook?id=" + this.block_list_id
        });
    },
    jumpPlayer: function() {
        wx.navigateTo({
            url: "/pages/vplayer/vplayer"
        });
    },
    onSwiperChange: function(e) {
        this.setData({
            current: e.detail.current
        });
    },
    onReady: function() {
        wx.setNavigationBarColor({
            backgroundColor: "#f8f8f8",
            frontColor: "#000000"
        });
    },
    onShow: function() {
        var e = this, t = +new Date();
        (t - this.time > 6e5 || getApp().refreshExplorePageData) && (getApp().refreshExplorePageData = !1, 
        this.time = t, this.requestData()), this.setData({
            audioIcon: {
                show: !!o.curAudio().hash,
                playing: o.playing()
            }
        }), this.audioIconCheckTimer = setInterval(function() {
            e.setData({
                audioIcon: {
                    show: !!o.curAudio().hash,
                    playing: o.playing()
                }
            });
        }, 2e3);
    },
    onHide: function() {
        clearInterval(this.audioIconCheckTimer);
    },
    onUnload: function() {
        clearInterval(this.audioIconCheckTimer);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});