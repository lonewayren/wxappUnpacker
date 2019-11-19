var e = require("../../service/common"), a = require("../../service/cash"), t = require("../../service/column"), r = require("../../utils/index"), n = require("../../service/shareimg/index");

Page({
    data: {
        balance: {
            amount: "",
            amount_format: ""
        },
        list: []
    },
    onLoad: function(e) {
        var a = this;
        getApp().login().then(function() {
            a.requestPosters();
        });
    },
    requestPosters: function() {
        var a = this;
        e.getSharesalePosters().then(function(e) {
            e = e.map(function(e) {
                return e.column_price_format = r.formatPrice(e.column_price), e.sharesale_back_amount_format = r.formatPrice(e.sharesale_back_amount), 
                e;
            }), a.setData({
                list: e
            });
        }).catch(function(e) {
            return r.error(e.msg);
        });
    },
    getBalance: function() {
        var e = this;
        a.getBalance().then(function(a) {
            a.amount_format = r.formatPrice(a.amount, 2), e.setData({
                balance: a
            });
        }).catch(function(e) {
            return r.error(e.msg);
        });
    },
    withdraw: function() {
        this.data.balance.amount > 0 && wx.navigateTo({
            url: "/pages/withdraw/withdraw"
        });
    },
    cashdeatil: function() {
        wx.navigateTo({
            url: "/pages/mycashdetail/mycashdetail"
        });
    },
    salerule: function() {
        wx.navigateTo({
            url: "/pages/gkwebview/gkwebview?url=" + encodeURIComponent("https://time.geekbang.org/rules/share")
        });
    },
    getPoster: function(e) {
        var a = e.currentTarget.dataset.sku;
        a && t.getShareSalePosterData(a.id).then(function(e) {
            var t = e.user, r = e.sharesale.poster_data;
            n.open("reward", {
                bg: r.bg.img,
                nic: t.nickname,
                nic_width: r.name.left,
                nic_height: r.name.top,
                nic_color: r.name.color,
                nic_weight: r.name.weight,
                nic_size: r.name.size,
                avatar: t.avatar || "https://static001.geekbang.org/resource/image/e4/3a/e4ab9fe063670d7f1dca99949ed1e23a.jpg",
                avatar_left: r.avatar.left,
                avatar_top: r.avatar.top,
                avatar_size: r.avatar.size,
                qr_left: r.qr.left,
                qr_top: r.qr.top,
                qr_size: r.qr.size,
                qr_padding: r.qr.padding,
                url: "https://time.geekbang.org/" + e.sharesale.type + "/intro/" + a.id + "?code=" + e.sharesale.code
            });
        }).catch(function(e) {
            return r.error(e.msg);
        });
    },
    onShow: function() {
        var e = this;
        getApp().login().then(function() {
            e.getBalance();
        });
    },
    onHide: function() {},
    onUnload: function() {}
});