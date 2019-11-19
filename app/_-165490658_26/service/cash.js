function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = e(require("../config/index.js")), r = e(require("../utils/requestzeus.js"));

module.exports = {
    getBalance: function() {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/my/cash/show"
        });
    },
    getDetail: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 20, u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/my/cash/detail",
            data: {
                size: e,
                prev: u
            }
        });
    },
    withdraw: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/cash/extract",
            data: {
                amount: e,
                channel: "wx_lite"
            }
        });
    },
    verifycash: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/cash/extract/verify",
            data: {
                sn: e
            }
        });
    }
};