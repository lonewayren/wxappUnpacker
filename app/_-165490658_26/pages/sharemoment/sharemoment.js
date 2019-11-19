var t = require("../../utils/index.js");

Page({
    data: {
        img: "",
        showSettingBtn: !1,
        hasRequest: !1
    },
    imgPromise: null,
    onLoad: function(t) {
        this.setData({
            img: getApp().shareImage()
        }), this.data.img && (this.imgPromise = this.downloadImg());
    },
    downloadImg: function() {
        var n = this;
        return new Promise(function(i, e) {
            wx.downloadFile({
                url: n.data.img,
                success: function(t) {
                    i(t.tempFilePath);
                },
                fail: function(n) {
                    t.error(n.errMsg), e();
                }
            });
        });
    },
    save: function() {
        var n = this;
        this.imgPromise.then(function(i) {
            wx.saveImageToPhotosAlbum({
                filePath: i,
                success: function() {
                    t.success("保存成功");
                },
                fail: function(t) {
                    wx.getSetting({
                        success: function(t) {
                            t.authSetting && t.authSetting["scope.writePhotosAlbum"] || n.setData({
                                showSettingBtn: !0,
                                hasRequest: !0
                            });
                        }
                    });
                }
            });
        }).catch(function(t) {});
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        this.data.hasRequest && wx.getSetting({
            success: function(n) {
                n.authSetting && n.authSetting["scope.writePhotosAlbum"] ? t.setData({
                    showSettingBtn: !1
                }) : t.setData({
                    showSettingBtn: !0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {}
});