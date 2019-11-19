function e(e, t) {
    return "save" === t ? 2 * e : e * i.windowWidth / 750;
}

function t(e) {
    return new Promise(function(t, l) {
        wx.downloadFile({
            url: e,
            success: function(e) {
                200 === e.statusCode && t(e.tempFilePath);
            },
            fail: function(e) {
                l(e);
            }
        });
    });
}

function l(t, l) {
    var i = "save" === (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).sizeType ? "save" : "display";
    return new Promise(function(a, r) {
        t.beginPath(), t.drawImage(l.bg_path, 0, 0, e(s, i), e(o, i)), t.save(), t.setStrokeStyle("#ffffff"), 
        t.setLineWidth(e(1, i)), t.arc(e(72.5, i), e(81.5, i), e(37.5, i), 0, 2 * Math.PI), 
        t.clip(), t.drawImage(l.avarar_path, e(35, i), e(44, i), e(75, i), e(75, i)), t.restore(), 
        t.drawImage(l.col_path, e(58, i), e(305, i), e(152, i), e(152, i)), t.drawImage(l.code_path, e(219, i), e(710, i), e(129, i), e(129, i)), 
        t.setTextAlign("left"), t.setTextBaseline("normal");
        var f = 0;
        l.last_coount >= 10 && (f = 10), l.last_coount >= 100 && (f = 20), l.last_coount >= 1e3 && (f = 30), 
        t.setFillStyle("#b67e34"), t.setFontSize(e(24, i)), t.fillText("还差", e(146 - f, i), e(602, i)), 
        t.setFillStyle("#b67e34"), t.setFontSize(e(24, i)), t.fillText("人即可拼团成功", e(240 + f, i), e(602, i)), 
        t.setFillStyle("#Af7628"), t.setFontSize(e(17, i)), t.fillText("快来加入我的团，一起学习", e(118, i), e(106, i)), 
        t.setFontSize(e(19, i)), t.setFillStyle("#ad936f"), t.fillText(l.co_author + " " + l.co_intro, e(227, i), e(363, i), e(296, i)), 
        t.setFontSize(e(18, i)), t.setFillStyle("#ad936f"), t.fillText(l.co_count + " 人已加入学习", e(227, i), e(390, i), e(263, i)), 
        t.setTextBaseline("bottom"), t.setTextAlign("right"), t.setFontSize(e(17, i)), t.setFillStyle("#cd9e5e"), 
        t.fillText("原价 ¥" + l.price, e(489, i), e(422, i), e(115, i)), t.setFontSize(e(41, i)), 
        t.setTextBaseline("normal"), t.setFillStyle("#cd9e5e"), t.setTextBaseline("bottom"), 
        t.fillText("¥" + l.pt_price, e(488, i), e(465, i), e(141, i)), t.setTextAlign("center"), 
        t.setTextBaseline("normal"), t.setFontSize(e(16, i)), t.setFillStyle("#828180"), 
        t.fillText("微信长按识别小程序 参与拼团", e(s, i) / 2, e(878, i)), t.setFontSize(e(41, i)), t.setFillStyle("#b77e34"), 
        t.fillText(l.last_coount, e(217, i), e(600, i)), t.setStrokeStyle("#d8af7c"), t.setLineWidth(e(1, i)), 
        t.moveTo(e(422, i), e(413, i)), t.lineTo(e(489, i), e(413, i)), t.stroke(), t.setTextAlign("left"), 
        t.setTextBaseline("normal"), t.font = "normal bold 22px sans-serif", t.setFillStyle("#Af7628"), 
        t.setFontSize(e(22, i)), t.fillText(n.subString(l.nicname, 28), e(118, i), e(81, i)), 
        t.font = "normal bold 28px sans-serif", t.setFontSize(e(28, i)), t.setFillStyle("#916a34"), 
        t.fillText(l.co_title, e(227, i), e(332, i)), t.font = "normal bold 35px sans-serif", 
        t.setTextBaseline("normal"), t.setTextAlign("center"), t.setFontSize(e(35, i)), 
        t.setFillStyle("#9d5c00"), t.fillText("拼团进行中", e(s, i) / 2, e(239, i)), t.font = "normal bold 25px sans-serif", 
        t.setTextAlign("center"), t.setFontSize(e(25, i)), t.setFillStyle("#b77e34"), t.fillText("限时成团，赶快加入", e(s, i) / 2, e(649, i)), 
        t.draw(), a();
    });
}

require("../qrcode");

var n = require("../../../utils/index.js"), i = wx.getSystemInfoSync(), s = 562, o = 1e3;

module.exports = {
    draw: function(e, n) {
        var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return new Promise(function(s, o) {
            var a = "", r = "", f = "", c = "";
            t("https://static001.geekbang.org/resource/image/2a/13/2addf4fc8d02f95099ebb47737931413.jpg").then(function(d) {
                a = d, t(n.avatar).then(function(d) {
                    r = d, t(n.co_poster).then(function(d) {
                        f = d, t(n.jhcode).then(function(t) {
                            c = t, n.bg_path = a, n.avarar_path = r, n.col_path = f, n.code_path = c;
                            var o = l(e, n, {
                                sizeType: "display"
                            });
                            return i.ctxSave && l(i.ctxSave, n, {
                                sizeType: "save"
                            }), s(o);
                        }).catch(function(e) {
                            o({
                                msg: "没有小程序码"
                            });
                        });
                    });
                });
            });
        });
    },
    getSize: function(t) {
        var l = "save" === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).sizeType ? "save" : "display";
        return {
            width: e(s, l),
            height: e(o, l)
        };
    },
    getInfo: function() {
        return {
            btnName: "保存分享海报"
        };
    }
};