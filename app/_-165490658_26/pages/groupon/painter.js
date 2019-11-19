module.exports = {
    draw: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, a = wx.createCanvasContext(e);
        return new Promise(function(n, i) {
            var s = "https://static001.geekbang.org/resource/image/3b/db/3bc3ad3e72aa19a2521c17cf1e5aa8db.png", c = "邀请好友组团一起学习", o = "拼团价 ¥ " + t.price + "，原价 ¥ " + t.priceOrigin, r = t.author, l = t.column;
            79 === Number(t.columnId) && +new Date("2018-07-16T00:00:00") - +new Date() > 0 && (s = "https://static001.geekbang.org/resource/image/ab/f1/ab10644d5f725158ca01e182ae036ef1.jpg", 
            c = "", o = "", r = "", l = ""), wx.downloadFile({
                url: s,
                success: function(t) {
                    200 === t.statusCode && (a.beginPath(), a.drawImage(t.tempFilePath, 0, 0, 500, 400), 
                    a.setTextAlign("center"), a.setTextBaseline("bottom"), a.setFillStyle("#9d5c00"), 
                    a.setFontSize(29), a.fillText(r, 250, 114, 441), a.setFontSize(35), a.fillText(l, 250, 170, 441), 
                    a.setFontSize(26), a.fillText(c, 250, 270, 441), a.fillText(o, 250, 325, 441), a.draw(!0, function() {
                        wx.canvasToTempFilePath({
                            canvasId: e,
                            success: function(e) {
                                n(e.tempFilePath);
                            },
                            fail: function(e) {
                                i(e);
                            }
                        });
                    }));
                },
                fail: function(e) {
                    utils.error(e.errMsg);
                }
            });
        });
    }
};