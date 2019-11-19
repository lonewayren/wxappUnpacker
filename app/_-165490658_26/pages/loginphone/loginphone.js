var t = require("../../service/user.js"), e = require("../../utils/index.js"), s = require("../../utils/validate");

Page({
    data: {
        type: 0,
        country: 86,
        countryList: [ "+86  中国" ],
        isSendingRequest: !1,
        isCounting: !1,
        countingSecond: 60,
        captcha: {
            img: "",
            show: !1
        },
        showPass: !1
    },
    timer: null,
    countryListData: [ {
        cn: "中国",
        code: 86,
        en: "China"
    } ],
    phone: "",
    sms: "",
    imgCaptcha: "",
    pass: "",
    ucode: "",
    redirect: "",
    onLoad: function(e) {
        var s = this;
        this.setData({
            type: "sms"
        });
        var a = wx.getStorageSync("PHONE_COUNTRIES");
        a ? (this.countryListData = a, this.setData({
            countryList: a.map(function(t) {
                return "+" + t.code + "  " + t.cn;
            })
        })) : t.getCellphoneList().then(function(t) {
            wx.setStorageSync("PHONE_COUNTRIES", t), s.countryListData = t, s.setData({
                countryList: t.map(function(t) {
                    return "+" + t.code + "  " + t.cn;
                })
            });
        }).catch(function(t) {}), e.redirect && (this.redirect = decodeURIComponent(e.redirect)), 
        e.gk_ucode && (this.ucode = e.gk_ucode);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {
        clearInterval(this.timer);
    },
    onUnload: function() {
        clearInterval(this.timer);
    },
    pickCode: function(t) {
        this.setData({
            country: this.countryListData[t.detail.value].code
        });
    },
    onPhoneInput: function(t) {
        this.phone = t.detail.value;
    },
    onSmsInput: function(t) {
        this.sms = t.detail.value;
    },
    onImgCaptchaInput: function(t) {
        this.imgCaptcha = t.detail.value;
    },
    onPassInput: function(t) {
        this.pass = t.detail.value;
    },
    switchType: function() {
        this.setData({
            type: "sms" === this.data.type ? "pass" : "sms"
        });
    },
    toggleShowPass: function() {
        this.setData({
            showPass: !this.data.showPass
        });
    },
    checkPhone: function(t, e) {
        return t ? s.checkMobile(t, e) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "请输入正确的手机号"
        } : {
            succ: !1,
            msg: "请输入手机号"
        };
    },
    checkPass: function(t) {
        return t ? s.checkPassword(t) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "请输入6-24位的密码"
        } : {
            succ: !1,
            msg: "请输入密码"
        };
    },
    sendBindSMS: function() {
        var t = this.checkPhone(this.phone, this.data.country);
        t.succ ? this.getPhoneCaptcha({
            country: this.data.country,
            phone: this.phone
        }) : e.error(t.msg);
    },
    getPhoneCaptcha: function(s) {
        var a = this, c = s.country, i = s.phone, n = s.captcha;
        this.data.isSendingRequest || (this.setData({
            isSendingRequest: !0
        }), t.sendLoginSMS(c, i, n).then(function(t) {
            wx.showToast({
                title: "验证码已发送到您手机",
                icon: "none"
            }), setTimeout(function() {
                a.setData({
                    isSendingRequest: !1
                });
            }, 1e3);
            var e = 60;
            a.timer = setInterval(function() {
                e <= 0 ? (a.setData({
                    isCounting: !1,
                    countingSecond: 0
                }), clearInterval(a.timer)) : (a.setData({
                    isCounting: !0,
                    countingSecond: e
                }), e--);
            }, 1e3);
        }).catch(function(t) {
            a.setData({
                isSendingRequest: !1
            }), -3004 === Number(t.code) || -3005 === Number(t.code) || -3006 === Number(t.code) ? (a.setData({
                captcha: {
                    img: "",
                    show: !0
                }
            }), a.refreshImgCaptcha(), n && e.error("图形验证码错误")) : e.error(t.msg);
        }));
    },
    checkCaptcha: function(t) {
        return t ? s.checkCaptcha(t) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "短信验证码不正确"
        } : {
            succ: !1,
            msg: "请输入短信验证码"
        };
    },
    refreshImgCaptcha: function() {
        var s = this;
        t.getImgCaptcha(this.getImgCaptchaType()).then(function(t) {
            s.setData({
                captcha: {
                    img: t.data,
                    show: s.data.captcha.show
                }
            });
        }).catch(function(t) {
            e.error("获取图片验证码失败，请重试");
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
        var s = this, a = this.checkImgCaptcha(this.imgCaptcha);
        if (!a.succ) return e.error(a.msg);
        t.checkImgCaptcha(this.getImgCaptchaType(), this.imgCaptcha).then(function(t) {
            s.hideImgCaptchaBox(), "sms" === s.data.type && s.getPhoneCaptcha({
                country: s.data.country,
                phone: s.phone,
                captcha: s.imgCaptcha
            }), "pass" === s.data.type && s.loginWithPass(s.imgCaptcha);
        }).catch(function(t) {
            e.error(t.msg);
        });
    },
    checkImgCaptcha: function(t) {
        return t ? s.checkImgCaptcha(t) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "图形验证码不正确"
        } : {
            succ: !1,
            msg: "请输入图形验证码"
        };
    },
    getImgCaptchaType: function() {
        return "sms" === this.data.type ? "smslogin" : "pass" === this.data.type ? "passlogin" : "";
    },
    login: function() {
        "sms" === this.data.type ? this.loginWithSms() : "pass" === this.data.type ? this.loginWithPass() : e.error("登录类型有误");
    },
    loginWithSms: function() {
        var s = this, a = this.checkPhone(this.phone, this.data.country), c = this.checkCaptcha(this.sms);
        if (a.succ) if (c.succ) {
            if (this.data.isSendingRequest) return;
            this.setData({
                isSendingRequest: !0
            });
            var i = this.phone, n = this.sms, o = this.ucode;
            t.loginBySms(this.data.country, i, n, o).then(function(t) {
                if (s.setData({
                    isSendingRequest: !1
                }), e.success("登录成功！"), getApp().updateLoginUser(t), s.redirect) {
                    var a = "&userType=" + t.type;
                    s.redirect += a, wx.navigateTo({
                        url: s.redirect
                    });
                } else setTimeout(function() {
                    wx.navigateBack({
                        delta: 2
                    });
                }, 600);
            }).catch(function(t) {
                s.setData({
                    isSendingRequest: !1
                }), -3004 === Number(t.code) || -3005 === Number(t.code) || -3006 === Number(t.code) ? (s.setData({
                    captcha: {
                        img: "",
                        show: !0
                    }
                }), s.refreshImgCaptcha(), captcha && e.error("图形验证码错误")) : e.error(t.msg);
            });
        } else e.error(c.msg); else e.error(a.msg);
    },
    loginWithPass: function(s) {
        var a = this, c = this.checkPhone(this.phone, this.data.country), i = this.checkPass(this.pass);
        if (c.succ) if (i.succ) {
            if (this.data.isSendingRequest) return;
            this.setData({
                isSendingRequest: !0
            }), t.loginByPass(this.data.country, this.phone, this.pass, s).then(function(t) {
                if (a.setData({
                    isSendingRequest: !1
                }), e.success("登录成功！"), getApp().updateLoginUser(t), a.redirect) {
                    a.redirect += "&userType=login", wx.navigateTo({
                        url: a.redirect
                    });
                } else setTimeout(function() {
                    wx.navigateBack({
                        delta: 2
                    });
                }, 600);
            }).catch(function(t) {
                a.setData({
                    isSendingRequest: !1
                }), -3004 === Number(t.code) || -3005 === Number(t.code) || -3006 === Number(t.code) ? (a.setData({
                    captcha: {
                        img: "",
                        show: !0
                    }
                }), a.refreshImgCaptcha(), s && e.error("图形验证码错误")) : e.error(t.msg);
            });
        } else e.error(i.msg); else e.error(c.msg);
    }
});