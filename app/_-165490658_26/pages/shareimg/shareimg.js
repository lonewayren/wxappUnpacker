var t = require("../../service/shareimg/index"), e = require("../../utils/index");

Page({
    data: {
        imgSize: {
            width: 0,
            height: 0
        },
        imgSaveSize: {
            width: 0,
            height: 0
        },
        info: {
            btnName: ""
        },
        btnMargin: 0,
        showBtn: !1,
        saving: !1,
        showSettingBtn: !1,
        hasRequest: !1
    },
    onLoad: function(a) {
        var i = this, n = t.getSize();
        this.setData({
            imgSize: n,
            imgSaveSize: t.getSize({
                sizeType: "save"
            }),
            btnMargin: n.width / n.height * 7,
            info: t.getInfo()
        });
        var s = wx.createCanvasContext("image"), o = wx.createCanvasContext("image-save");
        wx.showLoading({
            title: "加载中"
        }), t.draw(s, {
            ctxSave: o
        }).then(function() {
            wx.hideLoading(), i.setData({
                showBtn: !0
            });
        }).catch(function(t) {
            wx.hideLoading(), e.error(t && t.msg);
        });
    },
    onReady: function() {},
    onShow: function() {
        var t = this;
        this.data.hasRequest && wx.getSetting({
            success: function(e) {
                e.authSetting && e.authSetting["scope.writePhotosAlbum"] ? t.setData({
                    showSettingBtn: !1
                }) : t.setData({
                    showSettingBtn: !0
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    save: function() {
        var t = this;
        wx.saveImageToPhotosAlbum ? (this.setData({
            saving: !0
        }), wx.canvasToTempFilePath({
            canvasId: "image-save",
            x: 0,
            y: 0,
            success: function(a) {
                wx.saveImageToPhotosAlbum({
                    filePath: a.tempFilePath,
                    success: function() {
                        t.setData({
                            saving: !1
                        }), e.success("保存成功"), setTimeout(function() {
                            wx.navigateBack();
                        }, 1500);
                    },
                    fail: function(e) {
                        t.setData({
                            saving: !1
                        }), wx.getSetting({
                            success: function(e) {
                                e.authSetting && e.authSetting["scope.writePhotosAlbum"] || t.setData({
                                    showSettingBtn: !0,
                                    hasRequest: !0
                                });
                            }
                        });
                    }
                });
            },
            fail: function(a) {
                t.setData({
                    saving: !1
                }), e.error(a.errMsg);
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    }
});