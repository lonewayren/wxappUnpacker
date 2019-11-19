function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = require("../../service/column.js"), a = require("../../utils/index.js"), i = require("./painter"), o = require("../../service/shareimg/index");

Page({
    data: {
        code: "",
        co: {
            gr: {}
        },
        gr: {},
        user: {},
        showActionSheet: !1,
        shareActions: [],
        showReview: !1,
        showPayAction: !1,
        payActions: [ {
            key: "saveImg",
            name: "生成支付卡片"
        }, {
            key: "copy",
            name: "复制链接，网页支付"
        } ],
        isReview: !1
    },
    timer: -1,
    shareImg: "",
    subscribeType: 0,
    onLoad: function(t) {
        var e = "";
        t.code ? e = t.code : t.scene && (e = a.getQueryString("?" + decodeURIComponent(t.scene), "code")), 
        this.setData({
            code: e
        }), getApp().appstatus.isReview && this.setData({
            isReview: !0
        }), getApp().appstatus.showGrouponPoster && this.setData({
            shareActions: [ {
                key: "shareMoment",
                name: "生成拼团海报"
            } ]
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        getApp().login().then(function(e) {
            t.setData({
                user: e || {}
            }), t.requestData();
        });
    },
    onHide: function() {
        clearTimeout(this.timer);
    },
    onUnload: function() {},
    requestData: function() {
        var o = this;
        wx.hideShareMenu(), this.data.code && e.getGrouponInfo(this.data.code).then(function(e) {
            e.column.gr = e.groupbuy_new || {}, e.groupbuy.stat = e.groupbuy.status, e.groupbuy.jstat = 0, 
            e.groupbuy.had_join_others && (e.groupbuy.jstat = 2), e.groupbuy.had_join_this && (e.groupbuy.jstat = 1);
            var s = 1e3 * (e.groupbuy.etime - e.groupbuy.time);
            e.groupbuy.rtime = s > 0 ? s : 0, e.groupbuy.rtime > 0 && a.setCountdown(e.groupbuy.rtime, function(e, a) {
                o.timer = a, o.setData(t({}, "gr.rtime", e));
            }), wx.setNavigationBarTitle({
                title: "" + e.column.title
            }), o.setData({
                co: e.column,
                gr: e.groupbuy
            }), i.draw("canvas-share", {
                author: e.column.author_name,
                column: e.column.title,
                number: e.groupbuy.success_ucount - e.groupbuy.join_ucount,
                price: a.formatPrice(e.groupbuy.price),
                priceOrigin: a.formatPrice(e.column.price),
                columnId: e.column.id
            }).then(function(t) {
                o.shareImg = t, wx.showShareMenu();
                o.data.shareActions;
                getApp().appstatus.showGrouponPoster ? o.setData({
                    shareActions: [ {
                        key: "shareTimeline",
                        name: "分享给好友"
                    }, {
                        key: "shareMoment",
                        name: "生成拼团海报"
                    } ]
                }) : o.setData({
                    shareActions: [ {
                        key: "shareTimeline",
                        name: "分享给好友"
                    } ]
                });
            }).catch(function(t) {});
        }).catch(function(t) {
            return a.error(t.msg);
        });
    },
    onShareAppMessage: function() {
        wx.reportAnalytics("pgroup_click_share", {
            sku: this.data.co.sku,
            id: this.data.co.id,
            title: this.data.co.title,
            type: "转发好友"
        });
        var t = "组队学习，立省 ¥" + a.formatPrice(this.data.co.price - this.data.gr.price);
        return 79 === Number(this.data.co.id) && +new Date("2018-07-16T00:00:00") - +new Date() > 0 && (t = "加入我们战队，一起瓜分大奖"), 
        {
            title: t,
            path: "/pages/groupon/groupon?code=" + this.data.code,
            imageUrl: this.shareImg,
            success: function(t) {},
            fail: function(t) {}
        };
    },
    popupShare: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    selectAction: function(t) {
        if (this.setData({
            showActionSheet: !1
        }), "shareMoment" === t.detail) {
            wx.reportAnalytics("pgroup_click_share", {
                sku: this.data.co.sku,
                id: this.data.co.id,
                title: this.data.co.title,
                type: "分享海报"
            });
            var e = this.data.co, i = this.data.gr, s = this.data.user;
            o.open("groupon", {
                co_title: a.subString(e.title, 24) || "",
                co_poster: e.author_avatar || "https://static001.geekbang.org/resource/image/63/da/630bc61f77997ca19d674f4f4c8dc3da.png",
                co_author: a.subString(e.author_name, 8) || "",
                co_intro: a.subString(e.author_intro, 24) || "",
                pt_price: a.formatPrice(i.price) || "",
                price: a.formatPrice(e.price) || "",
                co_count: e.sub_count || "",
                last_coount: Number(i.success_ucount) - Number(i.join_ucount) || "",
                jhcode: i.wxlite_code,
                nicname: s.nickname || "",
                avatar: s.avatar || "https://static001.geekbang.org/resource/image/e4/3a/e4ab9fe063670d7f1dca99949ed1e23a.jpg"
            });
        }
    },
    navtoColumn: function() {
        var t = 3 === this.data.co.type ? "/pages/courseintro/courseintro?id=" + this.data.co.id : "/pages/column/column?id=" + this.data.co.id;
        this.data.co.had_sub ? wx.navigateTo({
            url: "" + t
        }) : this.data.co.had_sub || 1 !== this.data.gr.stat || 0 !== this.data.gr.jstat ? wx.navigateTo({
            url: "" + t
        }) : wx.navigateTo({
            url: t + "&joingroupbuy=" + this.data.gr.code + "." + this.data.gr.price + "." + this.data.gr.success_ucount
        });
    },
    gotoColumn: function() {
        wx.reportAnalytics("pgroup_click_detail", {
            sku: this.data.co.sku,
            id: this.data.co.id,
            title: this.data.co.title
        }), this.navtoColumn();
    },
    gotoStudy: function() {
        this.navtoColumn();
    },
    gotoProcess: function() {
        this.navtoColumn();
    },
    gotoRule: function() {
        wx.navigateTo({
            url: "/pages/gkwebview/gkwebview?url=" + encodeURIComponent("https://time.geekbang.org/rules/groupon")
        });
    },
    subscribe: function(t) {
        var e = Number(t.currentTarget.dataset.type);
        if (this.subscribeType = e, wx.reportAnalytics("pgroup_click_sub", {
            sku: this.data.co.sku,
            id: this.data.co.id,
            title: this.data.co.title,
            type: 3 === Number(e) ? "加入团购" : 2 === Number(e) ? "创建团购" : "正常购买"
        }), 1 === getApp().appstatus.pay) return this.setData({
            showReview: !0
        });
        if (2 === getApp().appstatus.pay) return this.setData({
            showPayAction: !0
        });
        if (getApp().isLogin()) {
            var a = "/pages/cashier/cashier?type=" + e;
            3 === Number(e) && (a = a + "&gcode=" + this.data.code), 2 === Number(e) && (a = a + "&cid=" + this.data.co.id), 
            1 === Number(e) && (a = a + "&cid=" + this.data.co.id), wx.navigateTo({
                url: a
            });
        } else wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    selectPayAction: function(t) {
        this.setData({
            showPayAction: !1
        });
        var e = void 0;
        1 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.co.id), 
        2 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.co.id + "?host=true"), 
        3 === this.subscribeType && (e = "https://time.geekbang.org/wxlite/groupbuy/" + this.data.co.id + "?host=false&code=" + this.data.gr.code);
        var i = 0;
        2 === this.subscribeType && (i = a.formatPrice(this.data.co.gr.price)), 3 === this.subscribeType && (i = a.formatPrice(this.data.gr.price)), 
        "copy" === t.detail && wx.setClipboardData({
            data: e,
            success: function() {
                wx.showModal({
                    title: "您的支付链接已成功复制",
                    content: "将该链接粘贴至微信或浏览器中打开，即可进入该专栏页完成支付",
                    showCancel: !1
                });
            },
            fail: function() {
                return a.error("复制链接失败，请重试");
            }
        }), "saveImg" === t.detail && o.open("pay", {
            title: this.data.co.title,
            unit: this.data.co.unit,
            price: a.formatPrice(this.data.co.price),
            priceGroup: i,
            url: e
        });
    },
    hideReview: function() {
        this.setData({
            showReview: !1
        });
    }
});