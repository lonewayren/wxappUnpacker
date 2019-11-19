function e(e, t, o) {
    return t in e ? Object.defineProperty(e, t, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = o, e;
}

var t = require("../../service/user.js"), o = require("../../service/common.js"), n = require("../../service/column.js"), i = require("../../utils/index.js"), r = require("../../helper/pingpp/pingpp.js"), a = require("../../service/shareimg/index");

Page({
    data: {
        orderInfo: {
            list: []
        },
        couponList: [],
        couldSelectCoupon: 0,
        selectedCoupon: null,
        needPay: 0,
        needPayFormat: "",
        shareSale: {
            sku: "",
            title: "",
            description: "",
            show: !1,
            step: 1
        },
        requesting: !1,
        user: {
            uid: 0,
            cellphone: ""
        }
    },
    type: "",
    options: "",
    product: {},
    groupon: {},
    onLoad: function(e) {
        this.options = e, this.type = Number(e.type), this.setData({
            user: getApp().loginUser()
        }), this.initData();
    },
    onReady: function() {},
    onShow: function() {
        this.requesting() || (this.setData({
            selectedCoupon: getApp().getCashier().selectedCoupon
        }), this.setNeedPay()), getApp().loginUser().uid !== this.data.user.uid && (console.log("change!"), 
        this.setData({
            user: getApp().loginUser()
        }), this.initData());
    },
    onHide: function() {},
    onUnload: function() {
        this.timer && clearTimeout(this.timer), getApp().clearCashier();
    },
    initData: function() {
        this.setData({
            orderInfo: {
                list: []
            },
            couponList: [],
            couldSelectCoupon: 0,
            selectedCoupon: null,
            needPay: 0,
            needPayFormat: "",
            shareSale: {
                sku: "",
                title: "",
                description: "",
                show: !1,
                step: 1
            },
            requesting: !1
        }), this.product = {}, this.groupon = {}, 1 === this.type ? this.options.cid && this.getOrderInfoAndCoupons(this.options.cid, this.type) : 2 === this.type ? this.options.cid && this.getOrderInfoAndCoupons(this.options.cid, this.type) : 3 === this.type && this.options.gcode && this.getOrderInfoAndCoupons(this.options.gcode, this.type);
    },
    getOrderInfoAndCoupons: function(e) {
        var t = this, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
        1 !== o && 2 !== o || n.getColumnInfo(e, {
            cache: !0
        }).then(function(e) {
            t.product = e;
            var n = 1 === o ? e.column_price : e.groupbuy.price, r = {
                list: [ {
                    id: e.id,
                    sku: e.column_sku,
                    count: 1,
                    price: {
                        sale: n,
                        saleFormat: i.formatPrice(n)
                    },
                    image: e.column_cover,
                    name: e.column_title
                } ],
                app_id: 3,
                invoice: !1
            };
            t.setData({
                orderInfo: r
            }), t.requestCoupons();
        }).catch(function(e) {
            return i.error(e.msg);
        }), 3 === o && n.getGrouponInfo(e, {
            cache: !0
        }).then(function(e) {
            t.groupon = e;
            var o = {
                list: [ {
                    id: e.column.id,
                    sku: e.column.sku,
                    count: 1,
                    price: {
                        sale: e.groupbuy.price,
                        saleFormat: i.formatPrice(e.groupbuy.price)
                    },
                    image: e.column.cover,
                    name: e.column.title
                } ],
                app_id: 3,
                invoice: !1
            };
            t.setData({
                orderInfo: o
            }), t.requestCoupons();
        }).catch(function(e) {
            return i.error(e.msg);
        });
    },
    requesting: function(e) {
        if (void 0 === e) return this.data.requesting;
        this.setData({
            requesting: !!e
        });
    },
    requestCoupons: function() {
        var e = this, t = this.generateGoods(), n = 2 === this.type ? {
            group_buy: {
                is_host: !0
            }
        } : void 0;
        this.requesting(!0), o.getCoupons(t, n).then(function(t) {
            if (e.requesting(!1), e.setDataSync({
                couponList: t.list,
                couldSelectCoupon: t.could_selected_count
            }), t.recommend) {
                var o = t.recommend.id, n = t.list.findIndex(function(e) {
                    return e.id === o;
                });
                -1 !== n && e.setDataSync({
                    selectedCoupon: n
                });
            }
        }).catch(function(t) {
            e.requesting(!1), i.error(t.msg);
        });
    },
    generateGoods: function() {
        return this.data.orderInfo.list.map(function(e) {
            return {
                sku: e.sku,
                num: e.count,
                amount: e.price.sale
            };
        });
    },
    setDataSync: function(e) {
        e.hasOwnProperty("couponList") && (e.couponList = e.couponList.map(function(e) {
            return e.amountFormat = i.formatPrice(e.amount), e;
        })), getApp().setCashier(e), this.setData(e), this.setNeedPay();
    },
    setNeedPay: function() {
        var e = this.preAmount() - this.discountAmount();
        this.setData({
            needPay: e,
            needPayFormat: i.formatPrice(e)
        });
    },
    selectCoupon: function() {
        this.requesting() || this.data.couldSelectCoupon && wx.navigateTo({
            url: "/pages/selectcoupon/selectcoupon"
        });
    },
    pay: function(e) {
        var n = this, a = e.detail.formId || "";
        this.data.orderInfo.list.length <= 0 || this.requesting() || (this.requesting(!0), 
        t.getOpenId().then(function(e) {
            var t = {
                summary: {
                    amount: n.preAmount(),
                    discount_amount: n.discountAmount(),
                    post_amount: 0,
                    actual_amount: n.data.needPay,
                    app_id: n.data.orderInfo.app_id || 3,
                    channel: 13
                },
                goods: n.generateGoods(),
                coupon: n.generateCoupon(),
                pays: [ {
                    channel: "wx_lite",
                    amount: n.data.needPay,
                    extra: {
                        open_id: e.openid
                    }
                } ],
                recv: {},
                invoice: n.generateInvoice(),
                callbackUrl: ""
            };
            2 === n.type && (t.extra = {
                group_buy: {
                    is_host: !0,
                    form_id: a
                }
            }), 3 === n.type && (t.extra = {
                group_buy: {
                    is_host: !1,
                    form_id: a,
                    code: n.groupon.groupbuy.code
                }
            }), o.order(t).then(function(e) {
                var t = JSON.parse(e.pay.ident);
                r.createPayment(t, function(t, o) {
                    "success" == t ? (n.data.orderInfo.list[0] && wx.reportAnalytics("subscribe_success", {
                        column_id: n.data.orderInfo.list[0].id,
                        column_sku: n.data.orderInfo.list[0].sku,
                        column_name: n.data.orderInfo.list[0].name
                    }), getApp().willRefresh(), wx.showLoading({
                        title: "交易确认中...",
                        mask: !0
                    }), setTimeout(function() {
                        n.checkPayStatus(e.order_no).then(function(e) {
                            e.groupBuy ? setTimeout(function() {
                                wx.hideLoading(), 3 === n.type ? wx.navigateBack() : wx.redirectTo({
                                    url: "/pages/groupon/groupon?code=" + e.groupBuy.code
                                });
                            }, 2e3) : e.shareSale ? (wx.hideLoading(), n.showShareSaleTip(e.shareSale)) : (wx.hideLoading(), 
                            wx.showToast({
                                title: "支付成功"
                            }), setTimeout(wx.navigateBack, 1e3));
                        }).catch(function(e) {
                            wx.hideLoading(), i.error(e.msg), setTimeout(wx.navigateBack, 1500);
                        });
                    }, 1e3)) : "cancel" === t ? (n.requesting(!1), i.error("支付已取消")) : (n.requesting(!1), 
                    o.msg ? i.error(t + ": " + o.msg) : i.error("支付取消"));
                });
            }).catch(function(e) {
                n.requesting(!1), i.error(e.msg);
            });
        }).catch(function(e) {
            n.requesting(!1), i.error("get openid error");
        }));
    },
    checkPayStatus: function(e) {
        var t = this, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 15;
        return new Promise(function(i, r) {
            if (n <= 0) return r({
                code: 1,
                msg: "支付成功"
            });
            o.checkPayStatus(e).then(function(o) {
                if (o.paid) {
                    var r = !(!o.share_sale || !o.share_sale.back_amount) && o.share_sale, a = !(!o.group_buy || !o.group_buy.code) && o.group_buy;
                    return i({
                        shareSale: r,
                        groupBuy: a
                    });
                }
                t.timer = setTimeout(function() {
                    return i(t.checkPayStatus(e, n - 1));
                }, 2e3);
            }).catch(function(o) {
                t.timer = setTimeout(function() {
                    return i(t.checkPayStatus(e, n - 1));
                }, 2e3);
            });
        });
    },
    showShareSaleTip: function(e) {
        e && e.back_amount && this.setData({
            shareSale: {
                show: !0,
                sku: e.sku,
                step: 1,
                title: e.title,
                description: e.description
            }
        });
    },
    chooseShareSaleTip: function(t) {
        var o = this;
        t.currentTarget.dataset.share ? this.getSharePoster(this.data.shareSale.sku).then(function(t) {
            var n = t.sharesale.poster_data || {}, i = t.user || {};
            a.open("reward", {
                bg: n.bg.img,
                nic: i.nickname,
                nic_width: n.name.left,
                nic_height: n.name.top,
                nic_color: n.name.color,
                nic_weight: n.name.weight,
                nic_size: n.name.size,
                avatar: i.avatar || "https://static001.geekbang.org/resource/image/e4/3a/e4ab9fe063670d7f1dca99949ed1e23a.jpg",
                avatar_left: n.avatar.left,
                avatar_top: n.avatar.top,
                avatar_size: n.avatar.size,
                qr_left: n.qr.left,
                qr_top: n.qr.top,
                qr_size: n.qr.size,
                qr_padding: n.qr.padding,
                url: "https://time.geekbang.org/" + t.sharesale.type + "/intro/" + o.data.orderInfo.list[0].id + "?code=" + t.sharesale.code
            }), setTimeout(function() {
                return o.setData(e({}, "shareSale.step", 2));
            }, 500);
        }).catch(function(t) {
            i.error(t.msg), o.setData(e({}, "shareSale.step", 2));
        }) : this.setData(e({}, "shareSale.step", 2));
    },
    closeShareSaleTip: function() {
        wx.navigateBack();
    },
    getSharePoster: function(e) {
        var t = this, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 2;
        return new Promise(function(i, r) {
            if (o <= 0) return r({
                code: 1,
                msg: "获取分享海报失败"
            });
            n.getShareSalePosterData(e, {
                isSku: !0
            }).then(function(n) {
                if (n.is_sharesale) return i(n);
                t.timer = setTimeout(function() {
                    return i(t.getSharePoster(e, o - 1));
                }, 2e3);
            }).catch(function(n) {
                t.timer = setTimeout(function() {
                    return i(t.getSharePoster(e, o - 1));
                }, 2e3);
            });
        });
    },
    preAmount: function() {
        return this.data.orderInfo.list.reduce(function(e, t) {
            return e += t.count * t.price.sale;
        }, 0);
    },
    discountAmount: function() {
        return this.data.couldSelectCoupon && -1 !== Number(this.data.selectedCoupon) && null !== this.data.selectedCoupon ? this.data.couponList[this.data.selectedCoupon].amount : 0;
    },
    generateCoupon: function() {
        if (this.data.couldSelectCoupon && -1 !== Number(this.data.selectedCoupon) && null !== this.data.selectedCoupon) {
            var e = this.data.couponList[this.data.selectedCoupon];
            return {
                id: e.id,
                code: e.code,
                amount: e.amount
            };
        }
        return {};
    },
    generateInvoice: function() {
        var e = {};
        return this.data.orderInfo.invoice && (e.type = this.data.orderInfo.invoiceType, 
        e.title = this.data.orderInfo.invoiceTitle, e.code = this.data.orderInfo.invoiceCode, 
        e.pattern = this.data.orderInfo.pattern), e;
    },
    gotoLogin: function() {
        wx.navigateTo({
            url: "/pages/login/login"
        });
    }
});