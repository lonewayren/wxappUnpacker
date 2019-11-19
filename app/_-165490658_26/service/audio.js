function t() {
    var t = c.current + 1;
    if (t <= c.list.length - 1) {
        c.current = t;
        var e = c.list[t];
        n.src = e.src, n.title = e.title, n.epname = e.title, n.singer = e.subTItle, n.coverImgUrl = e.cover, 
        n.play(), wx.reportAnalytics("play_audio", {
            article_id: e.id,
            article_name: e.title
        });
    } else i.error("已经是第最后一首了");
}

function e() {
    var t = c.current - 1;
    if (t >= 0) {
        c.current = t;
        var e = c.list[t];
        n.src = e.src, n.title = e.title, n.epname = e.title, n.singer = e.subTItle, n.coverImgUrl = e.cover, 
        n.play(), wx.reportAnalytics("play_audio", {
            article_id: e.id,
            article_name: e.title
        });
    } else i.error("已经是第一首了");
}

var r = require("../utils/eventbus"), i = require("../utils/index"), n = wx.getBackgroundAudioManager(), c = {
    state: 0,
    list: [],
    current: 0
};

module.exports = {
    init: function() {
        n.paused, n.onPlay(function() {
            n.paused, c.state = 0, r.emit("AUDIO_START", c.list[c.current]);
        }), n.onPause(function() {
            n.paused, r.emit("AUDIO_PAUSE", c.list[c.current]);
        }), n.onEnded(function() {
            c.state = 1, r.emit("AUDIO_ENDED", c.list[c.current]), c.current + 1 < c.list.length && t();
        }), n.onError(function(t) {
            c.state = 2, r.emit("AUDIO_ERROR", c.list[c.current]), wx.getNetworkType({
                success: function(t) {
                    "none" === t.networkType ? i.error("网络不给力") : i.error("播放失败");
                }
            });
        }), n.onTimeUpdate(function(t) {
            r.emit("AUDIO_TIME_UPDATE", {
                currentTime: n.currentTime,
                totalTime: n.duration
            });
        }), n.onPrev(function() {
            return e();
        }), n.onNext(function() {
            return t();
        });
    },
    play: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], e = arguments[1], r = t[e];
        r ? (c.list[c.current] && c.list[c.current].hash === t[e].hash && 0 === c.state ? n.play() : (n.src = r.src, 
        n.title = r.title, n.epname = r.title, n.singer = r.subTItle, n.coverImgUrl = r.cover, 
        n.play(), wx.reportAnalytics("play_audio", {
            article_id: r.id,
            article_name: r.title
        })), t = t.map(function(t) {
            return t.time_format = i.formatAudioTime(t.time, "sec"), t.size_format = i.formatSize(t.size), 
            t;
        }), c.list = t, c.current = e) : c.list[c.current] && (0 !== c.state ? (n.src = c.list[c.current].src, 
        n.title = c.list[c.current].title, n.epname = c.list[c.current].title, n.singer = c.list[c.current].subTItle, 
        n.coverImgUrl = c.list[c.current].cover, n.play()) : n.play());
    },
    pause: function() {
        n.pause();
    },
    prev: e,
    next: t,
    select: function(t) {
        if (t !== c.current) if (t <= c.list.length - 1 && t >= 0) {
            c.current = t;
            var e = c.list[t];
            n.src = e.src, n.title = e.title, n.epname = e.title, n.singer = e.subTItle, n.coverImgUrl = e.cover, 
            n.play(), wx.reportAnalytics("play_audio", {
                article_id: e.id,
                article_name: e.title
            });
        } else i.error("未找到音频");
    },
    seek: function(t) {
        0 !== c.state ? (n.src = c.list[c.current].src, n.play(), setTimeout(function() {
            n.seek(t);
        }, 200)) : (n.play(), setTimeout(function() {
            n.seek(t);
        }, 20));
    },
    playing: function() {
        return void 0 !== n.paused && !n.paused;
    },
    curAudio: function() {
        return c.list[c.current] || {};
    },
    curTime: function() {
        return n.currentTime || 0;
    },
    curIndex: function() {
        return c.current;
    },
    playList: function() {
        return c.list;
    }
};