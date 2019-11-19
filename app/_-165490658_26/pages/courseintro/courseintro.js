function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = require("../../service/column.js"), a = require("../../utils/index.js"), i = require("../../component/wxParse/wxParse.js"), o = require("../../service/shareimg/index");

Page({
    data: {
        show: "info",
        data: {},
        videoData: {},
        content: {},
        listData: [],
        lastWatch: 0,
        shareIconAnimate: !1,
        showActionSheet: !1,
        joingroupbuy: {
            code: "",
            price: 0,
            count: 0
        },
        showReview: !1,
        showPayAction: !1,
        payActions: [ {
            key: "saveImg",
            name: "生成支付卡片"
        }, {
            key: "copy",
            name: "复制链接，网页支付"
        } ],
        isReview: !1,
        isIOS: getApp().isIOS(),
        showAllGroup: !1
    },
    requesting: !1,
    timer: null,
    subscribeType: 0,
    onLoad: function(t) {
        var e, i = this, o = !1;
        if (t.id && t.id > 0 ? e = Number(t.id) : t.scene && (e = a.getQueryString("?" + decodeURIComponent(t.scene), "sku"), 
        o = !0), e ? getApp().login().then(function() {
            i.requestData(e, o, !0);
        }) : a.error("无效的商品ID : ("), getApp().appstatus.isReview && this.setData({
            isReview: !0
        }), t.joingroupbuy) {
            var s = t.joingroupbuy.split(".");
            this.setData({
                joingroupbuy: {
                    code: s[0],
                    price: s[1],
                    count: s[2]
                }
            });
        }
    },
    onShow: function() {
        var t = this;
        this.data.data.id && getApp().login().then(function() {
            t.requestData(t.data.data.id);
        }), this.timer = setTimeout(function() {
            t.setData({
                shareIconAnimate: !0
            });
        }, 2e3);
    },
    onHide: function() {
        this.timer && clearTimeout(this.timer), this.setData({
            shareIconAnimate: !1
        }), this.clearGroupTimer();
    },
    onUnload: function() {
        this.clearGroupTimer();
    },
    requestData: function(o) {
        var s = this, r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        this.requesting || (this.requesting = !0, e.getColumnInfo(o, {
            isSku: r
        }).then(function(e) {
            s.requesting = !1, n && wx.reportAnalytics("pageload_sku", {
                sku: e.column_sku,
                id: e.id,
                title: e.column_title
            });
            try {
                var o = JSON.parse(e.column_video_media);
                if (!o.sd.url) throw "";
                e.video_media = o;
            } catch (t) {
                a.error("未找到视频源"), e.video_media = {
                    hd: {
                        url: ""
                    },
                    sd: {
                        url: ""
                    }
                };
            }
            e.author_header_resize = a.resizeImg(e.author_header, 100, 100), e.column_price_format = a.formatPrice(e.column_price), 
            e.column_price_market_format = a.formatPrice(e.column_price_market), getApp().appstatus.isReview && (e.column_intro = e.column_intro.replace(/<li>[\s]*.*虚拟商品.*[\s]*<\/li>/, function() {
                return "";
            })), e.column_intro = a.formatContent(e.column_intro), getApp().isIOS() && (e.column_intro = e.column_intro.replace(/(<h2>|<h2\sclass="js-audit">)(订阅|购买)须知[\s\S]*<\/ol>/, "")), 
            i.wxParse("content", e.column_intro, s), s.setData({
                data: e,
                show: e.had_sub ? "table" : "info",
                videoData: {
                    video_media: e.video_media
                }
            }), e.groupbuy_list && (s.clearGroupTimer(), e.groupbuy_list.forEach(function(e, i) {
                e.left_seconds <= 0 || a.setCountdown(1e3 * e.left_seconds, function(a, o) {
                    e.timer = o, s.setData(t({}, "data.groupbuy_list[" + i + "].left_seconds", Math.round(a / 1e3)));
                });
            })), wx.setNavigationBarTitle({
                title: "" + e.column_title
            }), s.requestList(e.id);
        }).catch(function(t) {
            s.requesting = !1, a.error(t.msg);
        }));
    },
    requestList: function(t) {
        var i = this;
        e.getArticles(t, 0, "earliest", 200).then(function(t) {
            t.list = t.list.map(function(t) {
                return t.progress = t.video_play_seconds > 0 && t.video_total_seconds > 0 ? Math.round(t.video_play_seconds / t.video_total_seconds * 100) : 0, 
                t;
            });
            var e = 0;
            if (i.data.data.had_sub) {
                var a = 0;
                t.list.forEach(function(t, i) {
                    !isNaN(t.video_play_utime) && t.video_play_utime > a && (a = t.video_play_utime, 
                    e = i);
                });
            }
            i.setData({
                listData: t.list,
                lastWatch: e
            });
        }).catch(function(t) {
            return a.error(t.msg);
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: "" + this.data.data.column_share_title,
            path: "/pages/courseintro/courseintro?id=" + this.data.data.id,
            success: function(e) {
                wx.reportAnalytics("foward_column_success", {
                    column_id: t.data.data.id,
                    column_name: t.data.data.column_title
                });
            },
            fail: function(t) {}
        };
    },
    switchType: function(t) {
        var e = t.currentTarget.dataset.type;
        this.setData({
            show: e
        });
    },
    subscribe: function(t) {
        var e = Number(t.currentTarget.dataset.type) || 1;
        if (this.subscribeType = e, wx.reportAnalytics("click_subscribe", {
            column_id: this.data.data.id,
            column_sku: this.data.data.column_sku,
            column_name: this.data.data.column_title
        }), 1 === getApp().appstatus.pay) return this.setData({
            showReview: !0
        });
        if (2 === getApp().appstatus.pay) return this.setData({
            showPayAction: !0
        });
        if (getApp().isLogin()) {
            var a = "/pages/cashier/cashier?type=" + e;
            3 === Number(e) && (a = a + "&gcode=" + this.data.joingroupbuy.code), 2 === Number(e) && (a = a + "&cid=" + this.data.data.id), 
            1 === Number(e) && (a = a + "&cid=" + this.data.data.id), wx.navigateTo({
                url: a
            });
        } else wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    gotoStudyList: function(t) {
        var e = this.data.listData[t.currentTarget.dataset.i] || {};
        this.data.data.had_sub || e.article_could_preview ? (wx.reportAnalytics("click_column_preview", {
            column_id: this.data.data.id,
            column_name: this.data.data.column_title
        }), wx.navigateTo({
            url: "/pages/coursedetail/coursedetail?id=" + this.data.data.id + "&vid=" + e.id + "&from=course"
        })) : this.data.isIOS || wx.showModal({
            title: "",
            content: "请先订阅专栏解锁",
            showCancel: !1
        });
    },
    gotogroupbuy: function() {
        wx.navigateTo({
            url: "/pages/groupon/groupon?code=" + this.data.data.groupbuy.join_code
        });
    },
    selectPayAction: function(t) {
        this.setData({
            showPayAction: !1
        });
        var e = void 0;
        1 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.data.id), 
        2 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.data.id + "?host=true"), 
        3 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.data.id + "?host=false&code=" + this.data.joingroupbuy.code);
        var i = 0;
        2 === this.subscribeType && (i = a.formatPrice(this.data.data.groupbuy.price)), 
        3 === this.subscribeType && (i = a.formatPrice(this.data.joingroupbuy.price)), "copy" === t.detail && wx.setClipboardData({
            data: e,
            success: function() {
                wx.showModal({
                    title: "您的支付链接已成功复制",
                    content: "将该链接粘贴至微信或浏览器中打开，即可进入该课程页完成支付",
                    showCancel: !1
                });
            },
            fail: function() {
                return a.error("复制链接失败，请重试");
            }
        }), "saveImg" === t.detail && o.open("pay", {
            title: this.data.data.column_title,
            unit: this.data.data.column_unit,
            price: this.data.data.column_price_format,
            priceGroup: i,
            url: e
        });
    },
    hideReview: function() {
        this.setData({
            showReview: !1
        });
    },
    popupShare: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    selectAction: function(t) {
        this.setData({
            showActionSheet: !1
        }), "shareMoment" === t.detail && (wx.reportAnalytics("click_column_shareimage", {
            column_id: this.data.data.id,
            column_name: this.data.data.column_title
        }), getApp().shareImage(this.data.data.column_poster_wxlite), wx.navigateTo({
            url: "/pages/sharemoment/sharemoment"
        }));
    },
    gotoGroupRule: function() {
        wx.navigateTo({
            url: "/pages/gkwebview/gkwebview?url=" + encodeURIComponent("https://time.geekbang.org/rules/groupon")
        });
    },
    showAllGroups: function() {
        this.setData({
            showAllGroup: !0
        });
    },
    hideAllGroups: function() {
        this.setData({
            showAllGroup: !1
        });
    },
    gotoGroup: function(t) {
        var e = t.currentTarget.dataset.code;
        e && wx.navigateTo({
            url: "/pages/groupon/groupon?code=" + e
        });
    },
    clearGroupTimer: function() {
        this.data.data.groupbuy_list && this.data.data.groupbuy_list.forEach(function(t, e) {
            clearTimeout(t.timer);
        });
    },
    disableScroll: function() {}
});