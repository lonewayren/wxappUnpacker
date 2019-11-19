var t = require("../../utils/validate"), e = require("../../service/user.js"), n = require("../../utils/index.js");

Page({
    data: {
        step: 1,
        country: 86,
        countryList: [ "+86  中国" ],
        isSendingRequest: !1,
        isCounting: !1,
        countingSecond: 60,
        captcha: {
            img: "",
            show: !1
        },
        phoneInputFocus: !1
    },
    redirect: "",
    ucode: "",
    countryListData: [ {
        cn: "中国",
        code: 86,
        en: "China"
    } ],
    onLoad: function(t) {
        var n = this, c = wx.getStorageSync("PHONE_COUNTRIES");
        c ? (this.countryListData = c, this.setData({
            countryList: c.map(function(t) {
                return "+" + t.code + "  " + t.cn;
            })
        })) : e.getCellphoneList().then(function(t) {
            wx.setStorageSync("PHONE_COUNTRIES", t), n.countryListData = t, n.setData({
                countryList: t.map(function(t) {
                    return "+" + t.code + "  " + t.cn;
                })
            });
        }).catch(function(t) {}), t.redirect && (this.redirect = decodeURIComponent(t.redirect)), 
        t.gk_ucode && (this.ucode = t.gk_ucode);
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
    timer: null,
    phone: "",
    sms: "",
    imgCaptcha: "",
    sendBindSMS: function() {
        var t = this.checkPhone(this.phone, this.data.country);
        t.succ ? this.getPhoneCaptcha({
            country: this.data.country,
            phone: this.phone
        }) : n.error(t.msg);
    },
    checkPhone: function(e, n) {
        return e ? t.checkMobile(e, this.data.country) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "请输入正确的手机号"
        } : {
            succ: !1,
            msg: "请输入手机号"
        };
    },
    checkCaptcha: function(e) {
        return e ? t.checkCaptcha(e) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "短信验证码不正确"
        } : {
            succ: !1,
            msg: "请输入短信验证码"
        };
    },
    checkImgCaptcha: function(e) {
        return e ? t.checkImgCaptcha(e) ? {
            succ: !0
        } : {
            succ: !1,
            msg: "图形验证码不正确"
        } : {
            succ: !1,
            msg: "请输入图形验证码"
        };
    },
    getPhoneCaptcha: function(t) {
        var c = this, i = t.country, a = t.phone, s = t.captcha;
        this.setData({
            isSendingRequest: !0
        }), e.sendPlatformBindSMS(i, a, s).then(function(t) {
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
        }).catch(function(t) {
            c.setData({
                isSendingRequest: !1
            }), -3004 === Number(t.code) || -3005 === Number(t.code) || -3006 === Number(t.code) ? (c.setData({
                captcha: {
                    img: "",
                    show: !0
                }
            }), c.refreshImgCaptcha()) : n.error(t.msg);
        });
    },
    refreshImgCaptcha: function() {
        var t = this;
        e.getBindCaptcha().then(function(e) {
            t.setData({
                captcha: {
                    img: e.data,
                    show: t.data.captcha.show
                }
            });
        }).catch(function(t) {
            n.error("获取图片验证码失败，请重试");
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
        var t = this.checkImgCaptcha(this.imgCaptcha);
        t.succ ? (this.getPhoneCaptcha({
            country: this.data.country,
            phone: this.phone,
            captcha: this.imgCaptcha
        }), this.hideImgCaptchaBox()) : n.error(t.msg);
    },
    bindPhone: function() {
        var t = this, c = this.checkPhone(this.phone, this.data.country), i = this.checkCaptcha(this.sms);
        if (c.succ) if (i.succ) {
            this.setData({
                isSendingRequest: !0
            });
            var a = this.phone, s = this.sms, o = this.ucode, r = e.wxUserInfo.avatarUrl, u = e.wxUserInfo.nickName;
            e.bindPlatformBind(this.data.country, a, s, r, u, o).then(function(c) {
                if (t.setData({
                    isSendingRequest: !1
                }), c.uid > 0) if (n.success("绑定成功！"), getApp().updateLoginUser(c), t.redirect) {
                    var i = "&userType=" + c.type;
                    t.redirect += i, wx.navigateTo({
                        url: t.redirect
                    });
                } else setTimeout(function() {
                    wx.navigateBack({
                        delta: 2
                    });
                }, 600); else c.binded ? wx.showModal({
                    title: "确认关联账号",
                    content: "极客邦账号已经绑定了微信号「" + c.binded.nickname + "」，需要更换为「" + c.current.nickname + "」吗？",
                    showCancel: !0,
                    cancelText: "取消",
                    confirmText: "确认更换",
                    success: function(c) {
                        c.confirm && e.rebindPlatformBind().then(function(e) {
                            if (n.success("更换成功！"), getApp().updateLoginUser(e), t.redirect) {
                                t.redirect += "&userType=login", wx.navigateTo({
                                    url: t.redirect
                                });
                            } else setTimeout(function() {
                                wx.navigateBack({
                                    delta: 2
                                });
                            }, 600);
                        }).catch(function(t) {
                            return n.error(t.msg);
                        });
                    }
                }) : n.error("未知错误");
            }).catch(function(e) {
                t.setData({
                    isSendingRequest: !1
                });
                var c = e.msg ? e.msg : "绑定失败请重试";
                n.error(c);
            });
        } else n.error(i.msg); else n.error(c.msg);
    },
    pickCode: function(t) {
        this.setData({
            country: this.countryListData[t.detail.value].code
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onReachBottom: function() {}
});