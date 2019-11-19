function e(e, t) {
    return "save" === t ? e : e * l.windowWidth / 750;
}

function t(t, l) {
    var s = "save" === (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).sizeType ? "save" : "display";
    return new Promise(function(o, f) {
        t.setTextBaseline("top"), t.setTextAlign("center"), t.setFillStyle("#ffffff"), t.fillRect(0, 0, e(n, s), e(703, s)), 
        t.setFillStyle(r), t.setFontSize(e(37, s)), l.priceGroup ? t.fillText("拼团价：￥ " + l.priceGroup, e(n, s) / 2, e(163, s)) : t.fillText("￥ " + l.price + " / " + l.unit, e(n, s) / 2, e(163, s)), 
        t.setFontSize(e(26, s)), t.setFillStyle("#888888"), t.fillText("保存后可在微信里通过扫一扫打开", e(n, s) / 2, e(560, s)), 
        t.fillText("完成专栏订阅", e(n, s) / 2, e(604, s)), t.font = "normal bold 10px sans-serif", 
        t.setFontSize(e(45.6, s)), t.setFillStyle(r), t.fillText(l.title, e(n, s) / 2, e(80, s)), 
        t.setStrokeStyle(r), t.setLineWidth(e(1, s)), t.strokeRect(e((n - 278) / 2, s), e(238, s), e(278, s), e(278, s)), 
        i.fill({
            string: l.url,
            ctx: t,
            cavW: e(242, s),
            left: e((n - 242) / 2, s),
            top: e(256, s),
            color: "#000000",
            bgColor: "#ffffff"
        }), t.draw(), o();
    });
}

var i = require("../qrcode"), l = wx.getSystemInfoSync(), n = 560, r = "#fa8919";

module.exports = {
    draw: function(e, i) {
        var l = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return l.ctxSave && t(l.ctxSave, i, {
            sizeType: "save"
        }), t(e, i, {
            sizeType: "display"
        });
    },
    getSize: function(t) {
        var i = "save" === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).sizeType ? "save" : "display";
        return {
            width: e(560, i),
            height: e(703, i)
        };
    },
    getInfo: function() {
        return {
            btnName: "保存支付卡片"
        };
    }
};