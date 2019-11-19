var t = require("../../utils/index.js"), e = require("../../service/column.js");

Page({
    data: {
        count: 0
    },
    comment: "",
    requesting: !1,
    type: "",
    id: "",
    onLoad: function(t) {
        this.computeCount(), this.type = t.type, this.id = t.id;
    },
    handleInput: function(t) {
        this.comment = t.detail.value, this.computeCount();
    },
    computeCount: function() {
        this.setData({
            count: 2e3 - this.comment.length
        });
    },
    checkComment: function() {
        return !!this.comment || (t.error("评论不能为空"), !1);
    },
    submit: function() {
        var n = this;
        if (!this.requesting && this.checkComment()) if (this.data.count < 0) t.error("留言内容过长，请删减后重试"); else {
            this.requesting = !0;
            var i = "columnArticle" === this.type ? "columnArticle" : "course";
            e.commentArticle(this.id, this.comment, i).then(function(e) {
                n.requesting = !1, t.success("留言提交成功"), setTimeout(wx.navigateBack, 800);
            }).catch(function(e) {
                n.requesting = !1, t.error(e.msg);
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {}
});