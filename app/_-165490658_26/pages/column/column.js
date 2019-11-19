function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = require("../../service/user.js"), a = require("../../service/column.js"), i = require("../../utils/index.js"), o = require("../../component/wxParse/wxParse.js"), n = require("../../service/shareimg/index");

Page({
    data: {
        data: {},
        listData: {},
        content: {},
        showActionSheet: !1,
        shareIconAnimate: !1,
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
        ifShared: !1,
        joingroupbuy: {
            code: "",
            price: 0,
            count: 0
        },
        show: "info",
        showAllGroup: !1
    },
    requesting: !1,
    timer: null,
    subscribeType: 0,
    onLoad: function(t) {
        var e, a = this, o = !1;
        if (t.id && t.id > 0 ? e = Number(t.id) : t.scene && (e = i.getQueryString("?" + decodeURIComponent(t.scene), "sku"), 
        o = !0), e ? getApp().login().then(function() {
            a.requestData(e, o, !0);
        }) : i.error("无效的商品ID : ("), t.joingroupbuy) {
            var n = t.joingroupbuy.split(".");
            this.setData({
                joingroupbuy: {
                    code: n[0],
                    price: n[1],
                    count: n[2]
                }
            });
        }
        getApp().appstatus.isReview && this.setData({
            isReview: !0
        });
    },
    onShow: function() {
        var t = this;
        this.data.data.id && this.requestData(this.data.data.id), this.timer = setTimeout(function() {
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
    onReady: function() {},
    onUnload: function() {
        this.clearGroupTimer();
    },
    requestData: function(e) {
        var n = this, s = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        this.requesting || (this.requesting = !0, a.getColumnInfo(e, {
            isSku: s
        }).then(function(e) {
            n.requesting = !1, r && wx.reportAnalytics("pageload_sku", {
                sku: e.column_sku,
                id: e.id,
                title: e.column_title
            }), e.column_intro = i.formatContent(e.column_intro), getApp().isIOS() && (e.column_intro = e.column_intro.replace(/(<h2>|<h2\sclass="js-audit">)(订阅|购买)须知[\s\S]*<\/ol>/, "")), 
            e.column_price_format = i.formatPrice(e.column_price), e.column_price_market_format = i.formatPrice(e.column_price_market), 
            n.setData({
                data: e
            }), e.groupbuy_list && (n.clearGroupTimer(), e.groupbuy_list.forEach(function(e, a) {
                e.left_seconds <= 0 || i.setCountdown(1e3 * e.left_seconds, function(i, o) {
                    e.timer = o, n.setData(t({}, "data.groupbuy_list[" + a + "].left_seconds", Math.round(i / 1e3)));
                });
            })), getApp().appstatus.isReview && (e.column_intro = e.column_intro.replace(/<li>[\s]*.*虚拟商品.*[\s]*<\/li>/, function() {
                return "";
            })), o.wxParse("content", e.column_intro, n), wx.setNavigationBarTitle({
                title: "" + e.column_title
            }), e.is_shareget && n.pageInit(), n.requestList(e.id);
        }).catch(function(t) {
            n.requesting = !1, i.error(t.msg);
        }));
    },
    requestList: function(t) {
        var e = this;
        a.getArticles(t, 0, "earliest", 200).then(function(t) {
            t.list = t.list.map(function(t) {
                return t;
            }), e.setData({
                listData: t.list
            });
        }).catch(function(t) {
            return i.error(t.msg);
        });
    },
    onShareAppMessage: function(t) {
        var e = this;
        return setTimeout(function() {
            e.setData({
                ifShared: !0
            });
        }, 1e3), {
            title: "" + this.data.data.column_share_title,
            path: "/pages/column/column?id=" + this.data.data.id,
            success: function(t) {
                wx.reportAnalytics("foward_column_success", {
                    column_id: e.data.data.id,
                    column_name: e.data.data.column_title
                }), e.data.data.is_shareget && (e.setData({
                    ifShared: !0
                }), e.data.data.had_sub || e.getBookData());
            },
            fail: function(t) {}
        };
    },
    gotoArticle: function(t) {
        var e = t.currentTarget.dataset.item || {};
        this.data.data.had_sub || e.article_could_preview ? wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + e.id + "&from=column"
        }) : this.data.isIOS || wx.showModal({
            title: "",
            content: "请先订阅专栏解锁",
            showCancel: !1
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
        var e = "/pages/columnarticles/columnarticles?id=" + this.data.data.id;
        t.currentTarget.dataset.trial && (wx.reportAnalytics("click_column_preview", {
            column_id: this.data.data.id,
            column_name: this.data.data.column_title
        }), e += "&trial=1"), wx.navigateTo({
            url: e
        });
    },
    gotogroupbuy: function() {
        wx.navigateTo({
            url: "/pages/groupon/groupon?code=" + this.data.data.groupbuy.join_code
        });
    },
    switchType: function(t) {
        var e = t.currentTarget.dataset.type;
        this.setData({
            show: e
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
        var a = 0;
        2 === this.subscribeType && (a = i.formatPrice(this.data.data.groupbuy.price)), 
        3 === this.subscribeType && (a = i.formatPrice(this.data.joingroupbuy.price)), "copy" === t.detail && wx.setClipboardData({
            data: e,
            success: function() {
                wx.showModal({
                    title: "您的支付链接已成功复制",
                    content: "将该链接粘贴至微信或浏览器中打开，即可进入该专栏页完成支付",
                    showCancel: !1
                });
            },
            fail: function() {
                return i.error("复制链接失败，请重试");
            }
        }), "saveImg" === t.detail && n.open("pay", {
            title: this.data.data.column_title,
            unit: this.data.data.column_unit,
            price: this.data.data.column_price_format,
            priceGroup: a,
            url: e
        });
    },
    hideReview: function() {
        this.setData({
            showReview: !1
        });
    },
    pageInit: function() {
        var t = this, a = wx.getStorageSync("PHONE_COUNTRIES");
        a ? (this.countryListData = a, this.setData({
            countryList: a.map(function(t) {
                return "+" + t.code + "  " + t.cn;
            })
        })) : e.getCellphoneList().then(function(e) {
            wx.setStorageSync("PHONE_COUNTRIES", e), t.countryListData = e, t.setData({
                countryList: e.map(function(t) {
                    return "+" + t.code + "  " + t.cn;
                })
            });
        }).catch(function(t) {});
    },
    readBook: function() {
        this.data.data.had_sub ? wx.navigateTo({
            url: "/pages/columnarticles/columnarticles?id=" + this.data.data.id
        }) : this.getBookData();
    },
    getBookData: function() {
        var e = this;
        getApp().isLogin() ? a.shareforbook(this.data.data.id).then(function(a) {
            getApp().willRefresh(), e.setData(t({}, "data.had_sub", !0));
        }).catch(function(a) {
            -2023 === Number(a.code) ? (getApp().willRefresh(), e.setData(t({}, "data.had_sub", !0))) : i.error(a.msg);
        }) : wx.navigateTo({
            url: "/pages/login/login"
        });
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