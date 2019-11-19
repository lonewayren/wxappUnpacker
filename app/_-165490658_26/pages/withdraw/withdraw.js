var t = Object.assign || function(t) {
    for (var n = 1; n < arguments.length; n++) {
        var a = arguments[n];
        for (var e in a) Object.prototype.hasOwnProperty.call(a, e) && (t[e] = a[e]);
    }
    return t;
}, n = (require("../../service/common"), require("../../service/cash")), a = require("../../service/user"), e = require("../../utils/index");

Page({
    data: {
        balance: {
            amount: "",
            amount_format: ""
        },
        authorized: 0,
        nickname: "",
        cash: "",
        cashTip: ""
    },
    timer: null,
    onLoad: function(t) {
        this.getWxBindInfo();
    },
    getBalance: function() {
        var t = this;
        n.getBalance().then(function(n) {
            n.amount_format = e.formatPrice(n.amount, 2), t.setData({
                balance: n
            });
        }).catch(function(t) {
            return e.error(t.msg);
        });
    },
    onCashInput: function(t) {
        var n = t.detail.value || "", a = n.split(".");
        a[1] && a[1].length > 2 && (n = a[0] + "." + a[1].slice(0, 2)), this.setData({
            cash: n,
            cashTip: ""
        });
    },
    inputAllAmount: function() {
        this.setData({
            cash: e.formatPrice(this.data.balance.amount),
            cashTip: ""
        });
    },
    withdraw: function() {
        var t = this;
        if (this.data.authorized) {
            var a = 100 * Number(this.data.cash);
            if (!(a <= 0)) {
                if (a > this.data.balance.amount) return this.setData({
                    cashTip: "提现金额不足"
                });
                if (a < 100) return this.setData({
                    cashTip: "提现金额不得小于1元"
                });
                if (a > 5e5) return this.setData({
                    cashTip: "提现金额不得超过5000元"
                });
                this.disabled = !0, wx.showLoading({
                    title: "提现中...",
                    mask: !0
                }), n.withdraw(a).then(function(n) {
                    return t.getStatus(n.sn);
                }).then(function(t) {
                    wx.hideLoading(), e.success("提现成功"), setTimeout(wx.navigateBack, 1e3);
                }).catch(function(n) {
                    wx.hideLoading(), t.disabled = !1, e.error(n.msg || "提现失败，请重试"), t.getBalance();
                });
            }
        }
    },
    getStatus: function(t) {
        var a = this, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
        return new Promise(function(i, r) {
            if (e <= 0) return r({
                msg: "提现失败"
            });
            n.verifycash(t).then(function(n) {
                if (n.result) return i();
                a.timer = setTimeout(function() {
                    return i(a.getStatus(t, e - 1));
                }, 1e3);
            }).catch(function(n) {
                a.timer = setTimeout(function() {
                    return i(a.getStatus(t, e - 1));
                }, 1e3);
            });
        });
    },
    getWxBindInfo: function() {
        var t = this;
        a.getWxBindInfo().then(function(n) {
            t.setData({
                authorized: n.authorized,
                nickname: n.nickname
            }), t.getBalance();
        }).catch(function(t) {
            wx.navigateBack();
        });
    },
    bind: function(n) {
        var i = this;
        n.detail.userInfo && (wx.showLoading({
            mask: !0
        }), a.wxUserInfo = n.detail.userInfo, a.bindToWechat(t({}, n.detail, {
            avatar: n.detail.userInfo.avatarUrl,
            nickname: n.detail.userInfo.nickName
        })).then(function(t) {
            wx.hideLoading(), e.success("绑定成功"), i.getWxBindInfo();
        }).catch(function(t) {
            wx.hideLoading(), e.error(t.msg);
        }));
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});