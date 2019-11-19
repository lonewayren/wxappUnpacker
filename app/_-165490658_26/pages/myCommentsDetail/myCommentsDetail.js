var e = require("../../service/user.js"), t = require("../../service/shareimg/index"), n = require("../../utils/index.js");

Page({
    data: {
        comment: {}
    },
    onLoad: function(t) {
        var c = this, o = t.id;
        e.commentDtail(o).then(function(e) {
            if (e) {
                if (e.comment_ctime && (e.comment_ctime_stamp = e.comment_ctime, e.comment_ctime = n.formatTime2(e.comment_ctime, {
                    hasDate: !0
                })), e.comment_content) {
                    var t = n.formatHtml(e.comment_content);
                    e.comment_content = t.trim();
                }
                e.replies && 0 !== e.replies.length && (e.replies[0].ctime = n.formatDate2(e.replies[0].ctime, 1), 
                e.replies[0].content = n.formatHtml(e.replies[0].content).trim()), c.setData({
                    comment: e
                });
            }
        }).catch(function(e) {
            console.log(e), n.error(e.msg);
        });
    },
    del: function(t) {
        var c = t.currentTarget.dataset.comments.id;
        t.currentTarget.dataset.order;
        wx.showModal({
            content: "确定要删除该条留言么？",
            confirmText: "删除",
            cancelText: "取消",
            success: function(t) {
                if (t.confirm) e.delComment(c).then(function(e) {
                    n.success("删除成功"), setTimeout(function() {
                        wx.navigateBack();
                    }, 1500);
                }).catch(function(e) {
                    n.error(e.msg);
                }); else if (t.cancel) return;
            }
        });
    },
    sharecomment: function(e) {
        function c(e) {
            return e.replace(/(^\s*)|(\s*$)/g, "");
        }
        console.log(e);
        var o = e.currentTarget.dataset.comments, i = o.comment_content, r = o.comment_ctime_stamp, m = o.column_title || "极客时间", a = o.article_title, s = "course" !== o.source ? "https://time.geekbang.org/column/article/" + o.aid : "https://time.geekbang.org/course/detail/" + o.cid + "-" + o.aid;
        t.openComment("sharecomment", {
            content: c(i),
            nicname: n.subString(c(getApp().state.loginUser.nickname), 32),
            ctitle: c(m),
            atitle: c(a),
            timestamp: r,
            qrurl: s
        });
    },
    jump: function(e) {
        console.log(e);
        var t = e.currentTarget.dataset.comments, n = t.cid, c = t.aid;
        "course" === t.source && n ? wx.navigateTo({
            url: "/pages/coursedetail/coursedetail?id=" + n + "&vid=" + c
        }) : wx.navigateTo({
            url: "/pages/articlepro/articlepro?id=" + c
        });
    },
    onShow: function() {}
});