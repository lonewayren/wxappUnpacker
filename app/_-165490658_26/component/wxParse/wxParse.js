function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function e(e, i, n, r) {
    var o, s = n.data[r];
    if (s && 0 != s.images.length) {
        var g = s.images, d = a(e.detail.width, e.detail.height, n, r), l = g[i].index, c = "" + r, h = !0, u = !1, w = void 0;
        try {
            for (var f, v = l.split(".")[Symbol.iterator](); !(h = (f = v.next()).done); h = !0) c += ".nodes[" + f.value + "]";
        } catch (t) {
            u = !0, w = t;
        } finally {
            try {
                !h && v.return && v.return();
            } finally {
                if (u) throw w;
            }
        }
        var m = c + ".width", p = c + ".height";
        n.setData((o = {}, t(o, m, d.imageWidth), t(o, p, d.imageheight), o));
    }
}

function a(t, e, a, i) {
    var n = 0, r = 0, o = 0, d = {}, l = a.data[i].view.imagePadding;
    return n = s - 2 * l, g, t > n ? (o = (r = n) * e / t, d.imageWidth = r, d.imageheight = o) : (d.imageWidth = t, 
    d.imageheight = e), d;
}

function i(t) {
    var e = this, a = t.target.dataset.src, i = t.target.dataset.from;
    "a" !== t.target.dataset.ptag && void 0 !== i && i.length > 0 && wx.previewImage({
        current: a,
        urls: e.data[i].imageUrls
    });
}

function n(t) {
    var a = this, i = t.target.dataset.from, n = t.target.dataset.idx;
    void 0 !== i && i.length > 0 && e(t, n, a, i);
}

function r(t) {
    var e = String(t.currentTarget.dataset.src);
    if (e) {
        var a = e.match(/\/column\/article\/(\d+)/);
        if (a && a[1]) wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + a[1]
        }); else {
            if (getApp().isIOS()) return;
            e.indexOf("https://promo.geekbang.org") > -1 ? getApp().isLogin() ? wx.navigateTo({
                url: "/pages/gkwebview/gkwebview?url=" + encodeURIComponent(e)
            }) : getApp().navigateToLogin() : e.indexOf("http") > -1 ? wx.showModal({
                title: "",
                content: "" + e,
                showCancel: !0,
                confirmText: "复制链接",
                success: function(t) {
                    t.confirm && wx.setClipboardData({
                        data: "" + e,
                        success: function() {
                            wx.showToast({
                                title: "复制成功",
                                icon: "none"
                            });
                        },
                        fail: function() {
                            wx.showToast({
                                title: "复制失败"
                            });
                        }
                    });
                }
            }) : wx.showModal({
                title: "",
                content: "小程序不支持数学公式的显示，请在 App 内查看完整内容。",
                showCancel: !1
            });
        }
    }
}

var o = function(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}(require("./html2json.js")), s = 0, g = 0;

wx.getSystemInfo({
    success: function(t) {
        s = t.windowWidth, g = t.windowHeight;
    }
}), module.exports = {
    wxParse: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData", e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "<div>数据不能为空</div>", a = arguments[2], s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 5, g = a, d = o.default.html2json(e, t);
        d.view = {}, d.view.imagePadding = s || 0;
        var l = {};
        l[t] = d, g.setData(l), g.wxParseImgLoad = n, g.wxParseImgTap = i, g.wxParseTagATap = r;
    }
};