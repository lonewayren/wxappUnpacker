var t = require("../../service/column"), e = (require("../../utils/index"), require("../../utils/eventbus"));

Component({
    externalClasses: [ "iconfont", "icon-replay", "icon-play" ],
    properties: {
        data: {
            type: Object,
            value: {
                id: 0,
                article_could_preview: !1,
                hadSub: !1,
                video_media: {
                    hd: {
                        url: ""
                    },
                    sd: {
                        url: ""
                    }
                },
                autoplay: !1,
                video_total_seconds: 0,
                videoInitialSeconds: 0
            },
            observer: function(t, e) {
                var i, s = this;
                "course" === this.properties.type && !1 === t.hadSub && !1 === t.article_could_preview ? (i = "buy", 
                this.setData({
                    status: i,
                    title: "",
                    videoSrc: ""
                }), this.video && this.video.pause()) : getApp().noWifiTip(function(e) {
                    e.tip ? i = "wifi" : (i = "video", t.video_media && t.autoplay && s.video && setTimeout(function() {
                        s.video.play();
                    }, 1e3)), s.setData({
                        status: i,
                        title: "",
                        videoSrc: t.video_media ? t.video_media.hd.url : ""
                    });
                });
            }
        },
        list: {
            type: Array,
            value: []
        },
        index: {
            type: Number,
            value: 0
        },
        type: {
            type: String,
            value: "common"
        },
        fix: {
            type: Boolean,
            value: "true"
        }
    },
    data: {
        title: "",
        second: 0,
        login: !0,
        status: "video",
        showCancelNext: !1,
        videoSrc: "",
        useGesture: !0
    },
    created: function() {
    },
    ready: function() {
        this.videoCurTime = 0, this.video = wx.createVideoContext("video", this), this.setData({
            login: getApp().isLogin()
        }), this._addEvent();
        var t = getApp().systemInfo.platform.toLowerCase();
        this.setData({
            useGesture: t.indexOf("ios") < 0
        });
    },
    detached: function() {
        this.timer && clearInterval(this.timer), this._removeEvent();
    },
    videoCurTime: 0,
    video: null,
    timer: null,
    methods: {
        _addEvent: function() {
            var t = this;
            this.onWifiTip = function(e) {
                "video" === t.data.status && !1 === e.hasWifi && getApp().noWifiTip(function(e) {
                    e.tip && (t.video && t.video.pause(), t.setData({
                        status: "wifi"
                    }));
                });
            }, e.on("NETWORK_CHANGE", this.onWifiTip);
        },
        _removeEvent: function() {
            e.remove("NETWORK_CHANGE", this.onWifiTip);
        },
        onEnd: function() {
            var e = this;
            if ("course" === this.properties.type) {
                getApp().isLogin() && t.syncStudyProgress(this.properties.data.id, this.properties.data.video_total_seconds).then(function() {}).catch(function() {}), 
                this.videoCurTime = 0;
                var i = this.properties.index + 1, s = this.properties.list[i];
                s ? setTimeout(function() {
                    e.triggerEvent("next");
                }, 500) : s ? this.setData({
                    title: ""
                }) : this.setData({
                    status: "next",
                    showCancelNext: !1,
                    title: "当前已是最后一课"
                });
            }
        },
        onPlay: function() {
            "course" === this.properties.type && this.properties.list[this.properties.index] ? this.setData({
                status: "video",
                title: "当前播放：" + this.properties.list[this.properties.index].title_cut32
            }) : this.setData({
                status: "video",
                title: ""
            });
        },
        onTimeUpdate: function(e) {
            if ("course" === this.properties.type && getApp().isLogin()) {
                var i = e.detail.currentTime;
                i && i > this.properties.data.video_play_seconds && i - this.videoCurTime > 20 && (this.videoCurTime = i, 
                t.syncStudyProgress(this.properties.data.id, i).then(function() {}).catch(function() {}));
            }
        },
        subscribe: function() {
            this.triggerEvent("subscribe");
        },
        cancelNext: function() {
            this.setData({
                showCancelNext: !1
            }), this.timer && clearInterval(this.timer);
        },
        replay: function() {
            this.timer && clearInterval(this.timer), this.video && (this.video.seek(0), this.video.play());
        },
        continuePlay: function() {
            this.switchToVideoStatus();
        },
        ignoreWifiTips: function() {
            this.switchToVideoStatus(), getApp().noMoreWifiTips();
        },
        switchToVideoStatus: function() {
            var t = this;
            wx.getNetworkType({
                success: function(e) {
                    t.setData({
                        status: "video"
                    }), setTimeout(function() {
                        t.video.play();
                    }, 500);
                },
                fail: function(e) {
                    t.setData({
                        status: "video"
                    }), setTimeout(function() {
                        t.video.play();
                    }, 500);
                }
            });
        }
    }
});