function t(t, e, n) {
    return e in t ? Object.defineProperty(t, e, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = n, t;
}

var e = require("../../service/column.js"), n = (require("../../service/common.js"), 
require("../../service/audio.js"));

Page({
    data: {
        columns: {
            1: [],
            2: [],
            3: []
        },
        type: 1,
        audioIcon: {},
        isIOS: getApp().isIOS()
    },
    audioIconCheckTimer: null,
    onLoad: function(t) {
        var e = this;
        this.setData({
            type: Number(t.type) || 1
        }), getApp().login().then(function() {
            e.getData(e.data.type), e.getAllData();
        });
    },
    onShow: function() {
        var t = this;
        getApp().refreshColumnsPageData && (getApp().refreshExplorePageData = !1, this.getAllData()), 
        this.setData({
            audioIcon: {
                show: !!n.curAudio().hash,
                playing: n.playing()
            }
        }), this.audioIconCheckTimer = setInterval(function() {
            t.setData({
                audioIcon: {
                    show: !!n.curAudio().hash,
                    playing: n.playing()
                }
            });
        }, 2e3);
    },
    onPullDownRefresh: function() {
        this.getData(this.data.type);
    },
    onShareAppMessage: function(t) {
        return {
            title: "专栏订阅 | 极客时间",
            path: "/pages/columns/columns?type=" + this.data.type,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    getData: function(t) {
        this.getColumns(t || 1).then(function(t) {
            return wx.stopPullDownRefresh();
        }).catch(function(t) {
            return wx.stopPullDownRefresh();
        });
    },
    getAllData: function() {
        var t = this;
        setTimeout(function() {
            t.getColumns(1);
        }, 100), setTimeout(function() {
            t.getColumns(2);
        }, 200), setTimeout(function() {
            t.getColumns(3);
        }, 300);
    },
    getColumns: function(n) {
        var a = this;
        return new Promise(function(i, o) {
            e.getColumns(n).then(function(e) {
                a.setData(t({}, "columns[" + n + "]", e.list)), i(e.list);
            }).catch(function(t) {
                wx.showToast({
                    title: t.msg,
                    icon: "none"
                }), o(t);
            });
        });
    },
    switchType: function(t) {
        var e = Number(t.currentTarget.dataset.type);
        this.setData({
            type: e
        });
    },
    jump: function(t) {
        var e = t.currentTarget.dataset.item.id, n = t.currentTarget.dataset.item.had_sub;
        3 === this.data.type ? wx.navigateTo({
            url: "/pages/courseintro/courseintro?id=" + e
        }) : wx.navigateTo({
            url: n ? "/pages/columnarticles/columnarticles?id=" + e : "/pages/column/column?id=" + e
        });
    },
    onReady: function() {},
    onHide: function() {
        clearInterval(this.audioIconCheckTimer);
    },
    onUnload: function() {
        clearInterval(this.audioIconCheckTimer);
    }
});