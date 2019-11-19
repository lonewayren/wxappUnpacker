var e = require("../../service/shareimg/index"), t = require("../../utils/index");

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
        showBtn: !1,
        saving: !1
    },
    onLoad: function(e) {},
    onReady: function() {},
    onShow: function() {
        var i = this, a = wx.createCanvasContext("image"), n = wx.createCanvasContext("image-save");
        wx.showLoading({
            title: "加载中"
        }), e.draw(a, {
            ctxSave: n
        }).then(function(t) {
            i.setData({
                imgSize: e.getSize({
                    sizeType: "display"
                }),
                imgSaveSize: e.getSize({
                    sizeType: "save"
                }),
                info: e.getInfo()
            }), wx.hideLoading(), i.setData({
                showBtn: !0
            });
        }).catch(function(e) {
            wx.hideLoading(), t.error(e && e.msg);
        });
    },
    onHide: function() {},
    onUnload: function() {},
    save: function() {
        var e = this;
        wx.saveImageToPhotosAlbum ? this.data.saving || (this.setData({
            saving: !0
        }), wx.canvasToTempFilePath({
            canvasId: "image-save",
            x: 0,
            y: 0,
            success: function(i) {
                wx.saveImageToPhotosAlbum({
                    filePath: i.tempFilePath,
                    success: function() {
                        e.setData({
                            saving: !1
                        }), t.success("保存成功"), setTimeout(function() {
                            wx.navigateBack();
                        }, 500);
                    },
                    fail: function(t) {
                        e.setData({
                            saving: !1
                        }), wx.getSetting({
                            success: function(e) {
                                e.authSetting && e.authSetting["scope.writePhotosAlbum"] || wx.openSetting();
                            }
                        });
                    }
                });
            },
            fail: function(i) {
                e.setData({
                    saving: !1
                }), t.error(i.errMsg);
            }
        })) : wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
    }
});