var e = function(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}(require("./request"));

module.exports = function() {
    var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
    return t.method || (t.method = "POST"), new Promise(function(r, o) {
        wx.getNetworkType({
            success: function(e) {
                "none" === e.networkType && o({
                    code: 1002,
                    msg: "网络不给力",
                    res: {}
                });
            }
        }), (0, e.default)(t).then(function(e) {
            200 === e.statusCode && e.data && 0 === e.data.code ? r(e.data.data) : o(200 === e.statusCode && e.data && e.data.error && e.data.error.code ? {
                code: e.data.error.code,
                msg: e.data.error.msg,
                res: e
            } : {
                code: e.statusCode,
                msg: "request error with " + e.statusCode,
                res: e
            });
        }).catch(function(e) {
            o({
                code: 1001,
                msg: e.errMsg,
                res: e
            });
        });
    });
};