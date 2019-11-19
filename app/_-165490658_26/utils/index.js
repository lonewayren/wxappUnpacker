var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

!function(e) {
    e && e.__esModule;
}(require("../config/index.js"));

module.exports = {
    success: function(e) {
        wx.showToast({
            title: e
        });
    },
    error: function(e) {
        wx.showToast({
            title: e,
            icon: "none"
        });
    },
    formatHtml: function(e) {
        return e ? e.replace(/&lt;br&gt;/g, "\n").replace(/<br>/g, "\n").replace(/\\r/g, "\n").replace(/&#47;/g, "/").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"') : "";
    },
    resizeImg: function(e, t, r) {
        return isNaN(t) || isNaN(r) ? e : e && "string" == typeof e && e.match(/^https?:\/\/static[^.]+\.geekbang\.org\//i) ? e + "?x-oss-process=image/resize,m_fill,h_" + r + ",w_" + t : e;
    },
    setCountdown: function(e, t) {
        function r() {
            i++;
            var e = new Date().getTime() - (n + i * u), c = u - e;
            c < 0 && (c = 0), (o -= u) < 1e3 ? clearTimeout(a) : a = setTimeout(r, c), t && t(o, a);
        }
        if (e && !(e <= 0)) {
            var n = new Date().getTime(), o = e, i = 0, u = 1e3, a = setTimeout(r, u);
            return a;
        }
    },
    formatAudioTime: function(e) {
        if ("sec" === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "str")) {
            var t = Math.floor(e), r = Math.floor(t / 60), n = t % 60;
            return r = r < 10 ? "0" + r : r, n = n < 10 ? "0" + n : n, t = r + ":" + n;
        }
        return e.split(":").forEach(function(t, r) {
            0 === r && "00" === t && (e = e.substring(3));
        }), e;
    },
    calTime: function(t) {
        return "object" !== (void 0 === t ? "undefined" : e(t)) ? 0 : 3600 * Number(t.h) + 60 * Number(t.m) + Number(t.s);
    },
    formatPrice: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        if (e || (e = 0), Number(t) > 0) return (e / 100).toFixed(Number(t));
        var r = e / 100, n = r.toFixed(2).toString();
        return n.match(/\.00$/) ? Math.ceil(e / 100) : n.match(/\.\d0$/) ? r.toFixed(1) : r.toFixed(2);
    },
    formatDate: function(e, t) {
        if (t = t || "-", e) {
            var r = new Date(10 === String(e).length ? 1e3 * e : e), n = r.getMonth() + 1, o = r.getDate();
            return [ r.getFullYear(), (n > 9 ? "" : "0") + n, (o > 9 ? "" : "0") + o ].join(t);
        }
    },
    formatTime: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (!e) return "";
        var r = new Date(10 === String(e).length ? 1e3 * e : e), n = [ (r.getHours() > 9 ? "" : "0") + r.getHours(), (r.getMinutes() > 9 ? "" : "0") + r.getMinutes(), (r.getSeconds() > 9 ? "" : "0") + r.getSeconds() ].join(":");
        return t.hasDate ? this.formatDate(e) + " " + n : n;
    },
    cutStr: function(e, t) {
        var r = this.subString(e, t);
        return r !== e ? r + "..." : r;
    },
    subString: function(e, t) {
        if (!e) return "";
        var r = e.slice(0, t), n = r.replace(/[x00-xff]/g, "").length;
        switch (n) {
          case 0:
            return r;

          case t:
            return e.slice(0, t >> 1);

          default:
            var o = t - n, i = e.slice(o, t), u = i.replace(/[x00-xff]/g, "").length;
            return u ? e.slice(0, o) + this.subString(i, u) : e.slice(0, o);
        }
    },
    getTicket: function() {
        return wx.getStorageSync("TICKET");
    },
    getDeviceId: function() {
        return wx.getStorageSync("GCID");
    },
    logout: function() {
        wx.removeStorageSync("TICKET"), wx.removeStorageSync("DEVICEID");
    },
    formatSize: function(e) {
        var t = Number(e);
        return t < 1024 ? t : t < 1048576 ? (t / 1024).toFixed(2) + "K" : t < 1073741824 ? (t / 1024 / 1024).toFixed(2) + "M" : (t / 1024 / 1024 / 1024).toFixed(2) + "G";
    },
    formatContent: function(e) {
        return "string" != typeof e ? "" : (e = e.replace(/([\u4E00-\u9FA5])([a-z0-9@#&;=_\[\$\%\^\*\-\+\(\/])/gi, "$1 $2"), 
        e = e.replace(/([a-z0-9#!~&;=_\]\,\.\:\?\$\%\^\*\-\+\)\/])([\u4E00-\u9FA5])/gi, "$1 $2"));
    },
    getQueryString: function(e, t) {
        var r = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i"), n = (e.split("?").length > 1 ? e.split("?")[1] : "").match(r);
        return null !== n ? decodeURIComponent(n[2]) : "";
    },
    formatDate2: function(e, t) {
        if (e) {
            t = t || 1;
            var r = new Date(10 === String(e).length ? 1e3 * e : e), n = r.getMonth() + 1, o = r.getDate();
            return 1 === t ? r.getFullYear() + "年" + (n > 9 ? "" : "0") + n + "月" + (o > 9 ? "" : "0") + o + "日" : 2 === t ? r.getFullYear() + "-" + (n > 9 ? "" : "0") + n + "-" + (o > 9 ? "" : "0") + o : 3 === t ? r.getFullYear() + "/" + (n > 9 ? "" : "0") + n + "/" + (o > 9 ? "" : "0") + o : void 0;
        }
    },
    formatTime2: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (!e) return "";
        var r = new Date(10 === String(e).length ? 1e3 * e : e), n = [ (r.getHours() > 9 ? "" : "0") + r.getHours(), (r.getMinutes() > 9 ? "" : "0") + r.getMinutes() ].join(":");
        return t.hasDate ? this.formatDate2(e) + " " + n : n;
    }
};