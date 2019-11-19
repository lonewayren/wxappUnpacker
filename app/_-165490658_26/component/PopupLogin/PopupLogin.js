require("../../service/common.js");

var t = require("../../utils/index.js"), e = require("../../service/user.js"), n = require("../../utils/validate");

Component({
    properties: {
        show: {
            type: Boolean,
            value: !1,
            observer: function(t, e) {
                t && (this.getCountryList(), this.checkWxAuth());
            }
        }
    },
    data: {
        country: 86,
        countryList: [ "+86  中国" ],
        phoneInputFocus: !1,
        isCounting: !1,
        countingSecond: 60,
        isSendingRequest: !1,
        captcha: {
            img: "",
            show: !1
        },
        phoneNo: ""
    },
    countryListData: [ {
        cn: "中国",
        code: 86,
        en: "China"
    } ],
    phone: "",
    sms: "",
    imgCaptcha: "",
    methods: {
        getCountryList: function() {
            var t = this, n = wx.getStorageSync("PHONE_COUNTRIES");
            n ? (this.countryListData = n, this.setData({
                countryList: n.map(function(t) {
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
        checkWxAuth: function() {
            var e = this;
            wx.getSetting({
                success: function(n) {
                    n.authSetting["scope.userInfo"] || wx.showModal({
                        title: "",
                        content: "微信授权后才可继续操作",
                        confirmText: "授权微信",
                        showCancel: !0,
                        success: function(n) {
                            n.confirm && setTimeout(function() {
                                wx.openSetting({
                                    success: function(n) {
                                        n.authSetting["scope.userInfo"] ? getApp().login(!0).then(function(n) {
                                            n.uid && (t.success("登录成功"), e.triggerEvent("success"));
                                        }) : e.checkWxAuth();
                                    }
                                });
                            }, 120);
                        }
                    });
                }
            });
        },
        pickCode: function(t) {
            this.setData({
                country: this.countryListData[t.detail.value].code
            });
        },
        onSmsInput: function(t) {
            this.sms = t.detail.value;
        },
        onPhoneInput: function(t) {
            this.phone = t.detail.value, this.setData({
                phoneNo: t.detail.value
            });
        },
        onImgCaptchaInput: function(t) {
            this.imgCaptcha = t.detail.value;
        },
        sendBindSMS: function() {
            var e = this.checkPhone(this.phone, this.data.country);
            e.succ ? this.getPhoneCaptcha({
                country: this.data.country,
                phone: this.phone
            }) : t.error(e.msg);
        },
        checkPhone: function(t, e) {
            return t ? n.checkMobile(t, this.data.country) ? {
                succ: !0
            } : {
                succ: !1,
                msg: "请输入正确的手机号"
            } : {
                succ: !1,
                msg: "请输入手机号"
            };
        },
        checkCaptcha: function(t) {
            return t ? n.checkCaptcha(t) ? {
                succ: !0
            } : {
                succ: !1,
                msg: "短信验证码不正确"
            } : {
                succ: !1,
                msg: "请输入短信验证码"
            };
        },
        checkImgCaptcha: function(t) {
            return t ? n.checkImgCaptcha(t) ? {
                succ: !0
            } : {
                succ: !1,
                msg: "图形验证码不正确"
            } : {
                succ: !1,
                msg: "请输入图形验证码"
            };
        },
        getPhoneCaptcha: function(n) {
            var c = this, s = n.country, i = n.phone, a = n.captcha;
            this.setData({
                isSendingRequest: !0
            }), e.sendPlatformBindSMS(s, i, a).then(function(t) {
                wx.showToast({
                    title: "验证码已发送到您手机",
                    icon: "none"
                }), setTimeout(function() {
                    c.setData({
                        isSendingRequest: !1
                    });
                }, 1e3);
                var e = 60;
                c.timer = setInterval(function() {
                    e <= 0 ? (c.setData({
                        isCounting: !1,
                        countingSecond: 0
                    }), clearInterval(c.timer)) : (c.setData({
                        isCounting: !0,
                        countingSecond: e
                    }), e--);
                }, 1e3);
            }).catch(function(e) {
                c.setData({
                    isSendingRequest: !1
                }), -3004 === Number(e.code) ? (c.setData({
                    captcha: {
                        img: "",
                        show: !0
                    }
                }), c.refreshImgCaptcha()) : t.error(e.msg);
            });
        },
        refreshImgCaptcha: function() {
            var n = this;
            e.getBindCaptcha().then(function(t) {
                n.setData({
                    captcha: {
                        img: t.data,
                        show: n.data.captcha.show
                    }
                });
            }).catch(function(e) {
                t.error("获取图片验证码失败，请重试");
            });
        },
        hideImgCaptchaBox: function() {
            this.setData({
                captcha: {
                    img: "",
                    show: !1
                }
            });
        },
        imgCaptchaHandler: function() {
            var e = this.checkImgCaptcha(this.imgCaptcha);
            e.succ ? (this.getPhoneCaptcha({
                country: this.data.country,
                phone: this.phone,
                captcha: this.imgCaptcha
            }), this.hideImgCaptchaBox()) : t.error(e.msg);
        },
        bindPhone: function() {
            var n = this, c = this.checkPhone(this.phone, this.data.country), s = this.checkCaptcha(this.sms);
            if (c.succ) if (s.succ) {
                this.setData({
                    isSendingRequest: !0
                });
                var i = this.phone, a = this.sms, o = getApp().state.loginUser.avatar, h = getApp().state.loginUser.nickname;
                e.bindPlatformBind(this.data.country, i, a, o, h).then(function(c) {
                    n.setData({
                        isSendingRequest: !1
                    }), c.uid > 0 ? (t.success("绑定成功！"), getApp().updateLoginUser(c), n.triggerEvent("success")) : c.binded ? wx.showModal({
                        title: "确认关联账号",
                        content: "极客邦账号已经绑定了微信号「" + c.binded.nickname + "」，需要更换为「" + c.current.nickname + "」吗？",
                        showCancel: !0,
                        cancelText: "取消",
                        confirmText: "确认更换",
                        success: function(c) {
                            c.confirm && e.rebindPlatformBind().then(function(e) {
                                t.success("更换成功！"), getApp().updateLoginUser(e), n.triggerEvent("success");
                            }).catch(function(e) {
                                return t.error(e.msg);
                            });
                        }
                    }) : t.error("未知错误");
                }).catch(function(e) {
                    n.setData({
                        isSendingRequest: !1
                    });
                    var c = e.msg ? e.msg : "绑定失败请重试";
                    t.error(c);
                });
            } else t.error(s.msg); else t.error(c.msg);
        }
    }
});