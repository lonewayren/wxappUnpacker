function e(e, t) {
    return "save" === t ? .4 * e : e * r.windowWidth / 750;
}

function t(t, i, n) {
    t = t.trim();
    var l = "", r = [], o = !0, s = !1, a = void 0;
    try {
        for (var f, c = t[Symbol.iterator](); !(o = (f = c.next()).done); o = !0) {
            var u = f.value, v = l + u;
            i.measureText(v).width > e(534, n) || "\n" === u ? (r.push(l.replace("\n", "")), 
            l = u) : l = v;
        }
    } catch (e) {
        s = !0, a = e;
    } finally {
        try {
            !o && c.return && c.return();
        } finally {
            if (s) throw a;
        }
    }
    return r.push(l), r;
}

function i(i, r) {
    var s = "save" === (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).sizeType ? "save" : "display";
    return new Promise(function(a, f) {
        i.beginPath();
        var c = e(27, s);
        i.setFontSize(c), i.textBaseline = "top", i.setTextAlign("left");
        var u = t(r.content, i, s), v = e(140, s), x = e(210, s), T = e(10, s), d = 44 + 37 * u.length + 68;
        d < 336 && (d = 336), o = 171 + d + 334 + 34, i.setFillStyle("#fffcf7"), i.fillRect(0, 0, e(750, s), e(o, s)), 
        i.setFillStyle("#6E5F4A"), u.forEach(function(e, t) {
            i.fillText(e, v, t * (c + T) + x);
        }), i.font = "20px sans-serif", i.setStrokeStyle("#B4A89A"), i.setLineWidth(e(5, s)), 
        i.strokeRect(e(40, s), e(81, s), e(674, s), e(91 + d + 334, s)), i.moveTo(e(40, s), e(171, s)), 
        i.setLineWidth(e(2, s)), i.lineTo(e(713, s), e(171, s)), i.moveTo(e(40, s), e(171 + d, s)), 
        i.lineTo(e(713, s), e(171 + d, s)), i.moveTo(e(109, s), e(171, s)), i.lineTo(e(109, s), e(171 + d, s)), 
        i.moveTo(e(80, s), e(171 + d + 39, s)), i.lineTo(e(80, s), e(171 + d + 39 + 72, s)), 
        i.stroke(), i.textBaseline = "top", i.setFillStyle("#B8AEA3"), i.setTextAlign("left"), 
        i.setFontSize(e(22, s)), i.fillText("引自：" + r.ctitle, e(92, s), e(171 + d + 46, s)), 
        i.fillText(r.atitle, e(92, s), e(171 + d + 82, s)), i.setTextAlign("right"), i.setFillStyle("#9F8250"), 
        i.setFontSize(e(19, s)), i.fillText("识别二维码打开原文", e(528, s), e(171 + d + 261, s)), 
        i.fillText("「极客时间」 App", e(528, s), e(171 + d + 285, s)), n.fill({
            string: r.qrurl,
            ctx: i,
            cavW: e(121, s),
            left: e(554, s),
            top: e(171 + d + 181, s),
            color: "#9A7C48",
            bgColor: "#fffcf7"
        }), i.setTextAlign("left"), i.textBaseline = "normal", i.setFillStyle("#80704A"), 
        i.setFontSize(e(38, s)), i.fillText(l.subString(r.nicname, 28), e(82, s), e(144, s), e(593, s)), 
        i.translate(e(75, s), e(d / 2 + 171, s)), i.textBaseline = "middle", i.rotate(90 * Math.PI / 180), 
        i.setTextAlign("center"), i.setFontSize(e(22, s)), i.fillText("写于 " + l.formatDate2(r.timestamp, 3), e(0, s), e(0, s), e(593, s)), 
        i.rotate(-90 * Math.PI / 180), i.translate(-e(75, s), -e(d / 2 + 171, s)), i.draw(), 
        a();
    });
}

var n = require("../qrcode"), l = require("../../../utils/index.js"), r = wx.getSystemInfoSync(), o = 0;

module.exports = {
    draw: function(e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return new Promise(function(l, r) {
            var o = i(e, t, {
                sizeType: "display"
            });
            return n.ctxSave && i(n.ctxSave, t, {
                sizeType: "save"
            }), l(o);
        });
    },
    getSize: function(t) {
        var i = "save" === (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).sizeType ? "save" : "display";
        return {
            width: e(750, i),
            height: e(o, i)
        };
    },
    getInfo: function() {
        return {
            btnName: "保存分享海报"
        };
    }
};