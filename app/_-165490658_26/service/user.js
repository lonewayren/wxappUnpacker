function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = e(require("../utils/requestzeus")), n = e(require("../config/index.js")), r = e(require("../utils/request"));

module.exports = {
    wxUserInfo: {
        nickName: "",
        avatarUrl: ""
    },
    getLoginUser: function() {
        return new Promise(function(e, r) {
            (0, t.default)({
                url: n.default.accountServer + "/serv/v1/user/auth"
            }).then(function(t) {
                e(t);
            }).catch(function(e) {
                r(-2e3 === e.code ? e : e);
            });
        });
    },
    getWxBindInfo: function() {
        return (0, t.default)({
            url: n.default.accountServer + "/account/user/wechat"
        });
    },
    getOpenId: function() {
        return new Promise(function(e, r) {
            var u = wx.getStorageSync("OPENID");
            if (u) return e({
                openid: u
            });
            wx.login({
                success: function(u) {
                    u.code ? (0, t.default)({
                        url: n.default.accountServer + "/account/wx/auth",
                        data: {
                            app: "wxc4f8a6",
                            code: u.code
                        }
                    }).then(function(t) {
                        var n = t.openid;
                        return wx.setStorageSync("OPENID", n), e({
                            openid: n
                        });
                    }).catch(function(e) {
                        return r(e);
                    }) : r({
                        msg: u.errMsg,
                        res: err
                    });
                },
                fail: function(e) {
                    return r({
                        msg: e.errMsg,
                        res: e
                    });
                }
            });
        });
    },
    getWxIdV3: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(r, u) {
            var a = wx.getStorageSync("OPENID"), c = wx.getStorageSync("UNIONID");
            if (a && c && a !== c) return r({
                openid: a,
                unionid: c
            });
            var i = a && a === c ? 1 : 0;
            wx.login({
                success: function(a) {
                    a.code ? (0, t.default)({
                        url: n.default.accountServer + "/account/wx/authorize",
                        data: {
                            app: "wxc4f8a6",
                            code: a.code,
                            data: e.encryptedData,
                            iv: e.iv,
                            fix: i
                        }
                    }).then(function(e) {
                        var t = e.openid, n = e.unionid;
                        return wx.setStorageSync("OPENID", t), wx.setStorageSync("UNIONID", n), r({
                            openid: t,
                            unionid: n
                        });
                    }).catch(function(e) {
                        return u(e);
                    }) : u({
                        msg: a.errMsg,
                        res: err
                    });
                },
                fail: function(e) {
                    return u({
                        msg: e.errMsg,
                        res: e
                    });
                }
            });
        });
    },
    loginByWx: function() {
        var e = this, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Promise(function(u, a) {
            e.getWxIdV3(r).then(function(e) {
                var r = e.openid, c = e.unionid;
                (0, t.default)({
                    url: n.default.accountServer + "/account/bind/ticket",
                    data: {
                        uniqid: c,
                        subid: r,
                        type: 1,
                        platform: 4,
                        appid: 1
                    }
                }).then(function(e) {
                    Number(e.uid) > 0 ? u(e) : a({
                        code: 3001,
                        msg: "未绑定微信",
                        res: e
                    });
                }).catch(function(e) {
                    return a(e);
                });
            }).catch(function(e) {
                return a(e);
            });
        });
    },
    bindToWechat: function(e) {
        var r = this;
        return new Promise(function(u, a) {
            r.getWxIdV3(e).then(function(r) {
                var a = r.openid, c = r.unionid, i = (0, t.default)({
                    url: n.default.accountServer + "/account/oauth/appbind",
                    data: {
                        uniqid: c,
                        subid: a,
                        type: 1,
                        nickname: e.nickname,
                        avatar: e.avatar
                    }
                });
                return u(i);
            }).catch(function(e) {
                return a(e);
            });
        });
    },
    sendLoginSMS: function(e, r, u) {
        var a = {
            country: e,
            cellphone: r
        };
        return u && (a.captcha = u), (0, t.default)({
            url: n.default.accountServer + "/account/sms/code",
            data: a
        });
    },
    sendPlatformBindSMS: function(e, r, u) {
        var a = this;
        return new Promise(function(c, i) {
            a.getWxIdV3().then(function(a) {
                return c((0, t.default)({
                    url: n.default.accountServer + "/account/bind/code",
                    data: {
                        uniqid: a.unionid,
                        subid: a.openid,
                        country: e,
                        cellphone: r,
                        captcha: u,
                        type: 1
                    }
                }));
            }).catch(function(e) {
                return i(e);
            });
        });
    },
    loginBySms: function(e, r, u) {
        var a = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "";
        return (0, t.default)({
            url: n.default.accountServer + "/account/sms/login",
            data: {
                country: e,
                cellphone: r,
                code: u,
                ucode: a,
                platform: 4,
                appid: 1
            }
        });
    },
    loginByPass: function(e, r, u, a) {
        return (0, t.default)({
            url: n.default.accountServer + "/account/ticket/login",
            data: {
                country: e,
                cellphone: r,
                password: u,
                captcha: a || "",
                remember: 1,
                platform: 4,
                appid: 1
            }
        });
    },
    bindPlatformBind: function(e, r, u, a, c) {
        var i = this, o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "";
        return new Promise(function(d, f) {
            i.getWxIdV3().then(function(i) {
                return d((0, t.default)({
                    url: n.default.accountServer + "/account/bind/bind",
                    data: {
                        uniqid: i.unionid,
                        subid: i.openid,
                        client_id: "wxc4f8a61ef62e6e35",
                        country: e,
                        cellphone: r,
                        code: u,
                        avatar: a,
                        nickname: c,
                        ucode: o,
                        type: 1,
                        platform: 4,
                        appid: 1,
                        registe: !0
                    }
                }));
            }).catch(function(e) {
                f(e);
            });
        });
    },
    rebindPlatformBind: function() {
        var e = this;
        return new Promise(function(r, u) {
            e.getWxIdV3().then(function(e) {
                return r((0, t.default)({
                    url: n.default.accountServer + "/account/bind/rebind",
                    data: {
                        uniqid: e.unionid,
                        subid: e.openid,
                        client_id: "wxc4f8a61ef62e6e35",
                        type: 1,
                        appid: 1,
                        platform: 4
                    }
                }));
            }).catch(function(e) {
                return u(e);
            });
        });
    },
    getImgCaptcha: function(e) {
        return e = this.parseCaptchaType(e), (0, r.default)({
            url: n.default.accountServer + "/account/captcha/" + e,
            method: "GET",
            header: {
                Base64: 1
            }
        });
    },
    checkImgCaptcha: function(e, r) {
        return e = this.parseCaptchaType(e), (0, t.default)({
            url: n.default.accountServer + "/account/check/" + e,
            data: {
                captcha: r
            }
        });
    },
    parseCaptchaType: function(e) {
        return "smslogin" === e ? "smslogin" : "passlogin" === e ? "ticket" : "bindwechat" === e ? "wechat" : "";
    },
    getBindCaptcha: function() {
        return (0, r.default)({
            url: n.default.accountServer + "/account/captcha/wechat",
            method: "GET",
            header: {
                Base64: 1
            }
        });
    },
    getCellphoneList: function() {
        return (0, t.default)({
            url: n.default.accountServer + "/account/cellphone/list"
        });
    },
    getMyLikesList: function(e) {
        return (0, t.default)({
            url: n.default.timeServer + "/serv/v1/my/likes",
            data: e
        });
    },
    getCommentsList: function(e) {
        return (0, t.default)({
            url: n.default.timeServer + "/serv/v1/my/comments",
            data: {
                prev: e || 0
            }
        });
    },
    delComment: function(e) {
        return (0, t.default)({
            url: n.default.timeServer + "/serv/v1/comment/destroy",
            data: {
                id: e
            }
        });
    },
    commentDtail: function(e) {
        return (0, t.default)({
            url: n.default.timeServer + "/serv/v1/comment",
            data: {
                id: e
            }
        });
    }
};