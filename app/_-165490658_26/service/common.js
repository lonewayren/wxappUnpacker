function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var r = e(require("../config/index.js")), t = e(require("../utils/requestzeus.js"));

e(require("../utils/request.js"));

module.exports = {
    bindCoupon: function(e) {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/v1/coupon/bind",
            data: {
                code: e
            }
        });
    },
    getMyCoupon: function() {
        return (0, t.default)({
            url: r.default.accountServer + "/serv/v1/user/coupon"
        });
    },
    getMyData: function() {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/v1/my/data"
        });
    },
    getSharesalePosters: function() {
        var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
        return (0, t.default)({
            url: r.default.timeServer + "/serv/v1/my/sharesale/poster/list",
            data: {
                had_sub: e
            }
        });
    },
    getGroupingList: function() {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/v1/my/groupbuys",
            data: {
                status: 1,
                prev: 0
            }
        });
    },
    getAllGrouponList: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 20;
        return (0, t.default)({
            url: r.default.timeServer + "/serv/v1/my/groupbuys",
            data: {
                status: e,
                prev: u,
                size: a
            }
        });
    },
    checkReviewStatus: function() {
        return new Promise(function(e, u) {
            wx.getSystemInfo({
                success: function(u) {
                    e((0, t.default)({
                        url: r.default.timeServer + "/serv/v1/status",
                        data: {
                            wxlite_platform: u.platform.toLowerCase()
                        }
                    }));
                },
                fail: function() {
                    return u();
                }
            });
        });
    },
    checkPayStatus: function(e) {
        return (0, t.default)({
            url: r.default.cashierServer + "/serv/v1/order/verify",
            data: {
                order_no: e
            }
        });
    },
    order: function(e) {
        return (0, t.default)({
            url: r.default.cashierServer + "/serv/v1/order/store",
            data: e
        });
    },
    getCoupons: function(e, u) {
        var a = {
            goods: e,
            rsp_list: !0
        };
        return u && (a.extra = u), (0, t.default)({
            url: r.default.cashierServer + "/serv/v1/coupons",
            data: a
        });
    }
};