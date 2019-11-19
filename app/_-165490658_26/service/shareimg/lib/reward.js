function e(e, t) {
    return "save" === t ? 2 * e : e * n.windowWidth / 750;
}

function t(e) {
    return new Promise(function(t, a) {
        wx.downloadFile({
            url: e,
            success: function(e) {
                200 === e.statusCode && t(e.tempFilePath);
            },
            fail: function(e) {
                wx.showToast({
                    title: e.errMsg,
                    icon: "none"
                });
            }
        });
    });
}

function a(t, a) {
    var n = "save" === (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).sizeType ? "save" : "display";
    return new Promise(function(c, v) {
        t.beginPath(), t.drawImage(a.bg_path, 0, 0, e(r, n), e(o, n));
        var l = a.avatar_left, f = a.avatar_top, u = l + a.avatar_size / 2, d = f + a.avatar_size / 2, g = a.avatar_size / 2;
        t.save(), t.arc(e(u / s, n), e(d / s, n), e(g / s, n), 0, 2 * Math.PI), t.clip(), 
        t.drawImage(a.avatar, e(a.avatar_left / s, n), e(a.avatar_top / s, n), e(a.avatar_size / s, n), e(a.avatar_size / s, n)), 
        t.restore(), t.setTextBaseline("top"), t.setFillStyle("#" + a.nic_color), t.setFontSize(e(a.nic_size / s, n)), 
        t.fillText(a.nic, e(a.nic_width / s, n), e(a.nic_height / s, n)), i.fill({
            string: a.url,
            ctx: t,
            cavW: e(a.qr_size / s, n),
            left: e(a.qr_left / s, n),
            top: e(a.qr_top / s, n),
            color: "#000000",
            bgColor: "#ffffff",
            padding: e(a.qr_padding / s, n)
        }), t.draw(), c();
    });
}

var i = require("../qrcode"), n = wx.getSystemInfoSync(), r = 562, o = 1e3, s = 1242 / 562;

module.exports = {
    draw: function(e, i) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return new Promise(function(r, o) {
            t(i.bg).then(function(o) {
                i.bg_path = o, t(i.avatar).then(function(t) {
                    i.avatar = t;
                    var o = a(e, i, {
                        sizeType: "display"
                    });
                    return n.ctxSave && a(n.ctxSave, i, {
                        sizeType: "save"
                    }), r(o);
                });
            });
        });
    },
    getSize: function(t) {
        var a = "save" === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).sizeType ? "save" : "display";
        return {
            width: e(r, a),
            height: e(o, a)
        };
    },
    getInfo: function() {
        return {
            btnName: "保存分享海报"
        };
    }
};