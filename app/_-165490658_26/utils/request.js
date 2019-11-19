function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var r = arguments[t];
        for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (e[a] = r[a]);
    }
    return e;
}, r = e(require("./index")), a = e(require("../config/index")), i = wx.getSystemInfoSync();

module.exports = function() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    e.header = e.header || {};
    var E = r.default.getTicket(), n = r.default.getDeviceId();
    return E && (e.header.Ticket = E, e.header["X-GEEK-APP-TICKET"] = E, e.header["X-GEEK-APP-TICKET-FROM"] = "header"), 
    n && (e.header["Device-Id"] = n, e.header["X-GEEK-APP-DEVICE-ID"] = n), getApp() && getApp().state.loginUser.uid && (e.header["X-GEEK-APP-UID"] = getApp().state.loginUser.uid), 
    e.header["X-GEEK-APP-NAME"] = "wxlite-time", e.header["X-GEEK-VER-CODE"] = a.default.version, 
    e.header["X-GEEK-VER-NAME"] = a.default.version, e.header["X-GEEK-OS-NAME"] = "" + i.platform, 
    e.header["X-GEEK-OS-VER"] = i.SDKVersion + "-" + i.version, e.header["X-GEEK-OS-PLATFORM"] = i.system + "-" + i.brand, 
    e.header["X-GEEK-APP-DEVICE-MODEL"] = "" + i.model, new Promise(function(r, a) {
        wx.request(t({}, e, {
            success: function(e) {
                if (200 === e.statusCode && 0 === e.data.code) {
                    var t = {};
                    for (var a in e.header) t[String(a).toLowerCase()] = e.header[a];
                    if (t["set-ticket"]) wx.setStorageSync("TICKET", t["set-ticket"]); else {
                        var i = t["set-cookie"] || "";
                        if (i) {
                            var E = i.match(/GCID=([^;]+);/), n = i.match(/GCESS=([^;]+);/);
                            E && wx.setStorageSync("GCID", E[1]), n && wx.setStorageSync("TICKET", n[1]);
                        }
                    }
                }
                r(e);
            },
            fail: function(e) {
                a(e);
            }
        }));
    });
};