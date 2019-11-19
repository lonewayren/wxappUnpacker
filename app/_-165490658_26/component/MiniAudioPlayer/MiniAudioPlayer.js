var i = require("../../utils/eventbus"), t = require("../../service/audio"), o = require("../../utils/index");

Component({
    properties: {
        data: Object,
        column: Object
    },
    data: {
        playing: !1
    },
    attached: function() {
        this._addEvent(), t.playing() && this.onAudioStart(t.curAudio());
    },
    detached: function() {
        this._removeEvent();
    },
    methods: {
        _addEvent: function() {
            var t = this;
            this.onAudioStart = function(i) {
                i.hash === t.properties.data.audio_md5 && t.setData({
                    playing: !0
                });
            }, this.onAudioPause = function(i) {
                i.hash === t.properties.data.audio_md5 && t.setData({
                    playing: !1
                });
            }, this.onAudioError = function(i) {
                t.setData({
                    playing: !1
                });
            }, this.onAudioEnded = function(i) {
                t.setData({
                    playing: !1
                });
            }, i.on("AUDIO_START", this.onAudioStart), i.on("AUDIO_PAUSE", this.onAudioPause), 
            i.on("AUDIO_ERROR", this.onAudioError), i.on("AUDIO_ENDED", this.onAudioEnded);
        },
        _removeEvent: function() {
            i.remove("AUDIO_START", this.onAudioStart), i.remove("AUDIO_PAUSE", this.onAudioPause), 
            i.remove("AUDIO_ERROR", this.onAudioError), i.remove("AUDIO_ENDED", this.onAudioEnded);
        },
        play: function() {
            this.playAudio();
        },
        pause: function() {
            this.pauseAudio();
        },
        playAudio: function() {
            var i = this.properties.data || {}, e = this.properties.column || {};
            t.play([ {
                hash: i.audio_md5,
                src: i.audio_download_url,
                cover: e.column_cover || i.article_cover,
                bgcolor: e.column_bgcolor || i.column_bgcolor,
                columnId: e.id,
                title: i.article_title,
                subTitle: i.author_name,
                size: i.audio_size,
                time: o.calTime(i.audio_time_arr),
                id: i.id,
                like_count: i.like_count,
                had_liked: i.had_liked,
                shareImg: i.article_poster_wxlite
            } ], 0), this.setData({
                playing: !0
            });
        },
        pauseAudio: function() {
            t.pause(), this.setData({
                playing: !1
            });
        }
    }
});