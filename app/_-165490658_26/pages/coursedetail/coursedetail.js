function t(t, e, i) {
    return e in t ? Object.defineProperty(t, e, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = i, t;
}

function e(t) {
    if (Array.isArray(t)) {
        for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
        return i;
    }
    return Array.from(t);
}

var i = require("../../service/column.js"), n = require("../../utils/index.js"), a = require("../../component/wxParse/wxParse.js"), r = require("../../service/shareimg/index");

Page({
    data: {
        id: 0,
        vid: 1,
        data: {},
        videoList: [],
        currentArticle: {},
        content: {},
        currentIndex: -1,
        comments: [],
        commentPage: {
            count: 0,
            more: !1
        },
        windowWidth: 0,
        showActionSheet: !1,
        showReview: !1,
        showPayAction: !1,
        payActions: [ {
            key: "saveImg",
            name: "生成支付卡片"
        }, {
            key: "copy",
            name: "复制链接，网页支付"
        } ],
        isReview: !1,
        isIOS: getApp().isIOS(),
        from: ""
    },
    video: null,
    prevComment: 0,
    onLoad: function(t) {
        var e = this;
        this.from = t.from;
        var i = t.id || 0, a = t.vid || 0;
        i && a ? (this.setData({
            id: i,
            vid: a
        }), this.requestInfo(!0).then(function(t) {
            e.requestArticleList();
        })) : n.error("无效的课程ID：("), wx.getSystemInfo({
            success: function(t) {
                e.setData({
                    windowWidth: t.windowWidth
                });
            }
        }), getApp().appstatus.isReview && this.setData({
            isReview: !0
        });
    },
    onShow: function() {
        var t = this;
        this.data.data.id && this.requestInfo().then(function(e) {
            return t.requestArticleList();
        });
    },
    onReady: function() {
        this.video = wx.createVideoContext("video");
    },
    requestInfo: function() {
        var t = this, e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return new Promise(function(a, r) {
            i.getColumnInfo(t.data.id).then(function(i) {
                e && wx.reportAnalytics("pageload_sku", {
                    sku: i.column_sku,
                    id: i.id,
                    title: i.column_title
                }), i.column_price_format = n.formatPrice(i.column_price), i.column_price_market_format = n.formatPrice(i.column_price_market), 
                t.setData({
                    data: i
                }), wx.setNavigationBarTitle({
                    title: "" + i.column_title
                }), a(i);
            }).catch(function(t) {
                return n.error(t.msg);
            });
        });
    },
    requestArticleList: function() {
        var t = this;
        i.getArticles(this.data.id, 0, "earliest", 200).then(function(e) {
            t.setData({
                videoList: t.videoListAdapter(e.list),
                currentIndex: 0 === t.data.vid ? t.data.currentIndex : e.list.findIndex(function(e) {
                    return Number(e.id) === Number(t.data.vid);
                })
            }), e.list.length > 0 && t.requestArticleData(t.data.vid);
            const vList = t.videoListAdapter(e.list)
            vList.forEach(function (item, index) {
              console.info(item.title_cut32, "观看请移步:", "https://m3u8play.com/?play="+item.media.hd.url)
            })
        }).catch(function(t) {
            n.error(t.msg);
        });
    },
    requestArticleData: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        t && (this.requestArticleDetail(t, e), this.requestComments(t, !0));
    },
    requestArticleDetail: function(t) {
        var e = this, r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        t && i.getArticle(t).then(function(t) {
            try {
                var i = JSON.parse(t.video_media);
                if (!i.sd.url) throw "";
                t.video_media = i;
            } catch (e) {
                n.error("未找到视频源"), t.video_media = {
                    hd: {
                        url: ""
                    },
                    sd: {
                        url: ""
                    }
                };
            }
            t.showContent = t.article_content && !/^<p>无<\/p>/.test(t.article_content), a.wxParse("content", t.article_content, e), 
            t.videoInitialSeconds = t.video_play_seconds < t.video_total_seconds - 8 ? t.video_play_seconds : 0, 
            t.hadSub = e.data.data.had_sub, t.autoplay = r, e.setData({
                currentArticle: t
            });
        }).catch(function(t) {
            return n.error(t.msg);
        });
    },
    requestComments: function(t) {
        var a = this, r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        t && i.getArticleComments(t, r ? 0 : this.prevComment).then(function(t) {
            t.list = t.list.map(function(t) {
                return t.comment_content = n.formatHtml(t.comment_content), t.user_name_cut30 = n.cutStr(t.user_name, 30), 
                t.comment_ctime_format = n.formatDate(t.comment_ctime), t.replies && t.replies[0] && (t.replies[0].ctime_format = n.formatDate(t.replies[0].ctime), 
                t.replies[0].content = n.formatHtml(t.replies[0].content)), t;
            }), t.list.length && (a.prevComment = t.list[t.list.length - 1].score), a.setData({
                comments: r ? t.list : [].concat(e(a.data.comments), e(t.list)),
                commentPage: t.page || {}
            });
        }).catch(function(t) {
            return n.error(t.msg);
        });
    },
    onReachBottom: function() {
        this.data.currentArticle.id && this.data.commentPage.more && this.requestComments(this.data.currentArticle.id);
    },
    switchIntro: function() {
        wx.navigateTo({
            url: "/pages/courseintro/courseintro?id=" + this.data.id
        });
    },
    switchVideo: function(t) {
        var e = t.currentTarget.dataset.index;
        e !== this.data.currentIndex && this.setCurrentIndex(e);
    },
    setCurrentIndex: function(t) {
        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], i = this.data.videoList[t];
        if (!i) return n.error("未找到该视频");
        this.setData({
            vid: i.id,
            currentIndex: t
        }), this.data.data.had_sub || i.trial ? this.requestArticleData(this.data.vid, e) : this.setData({
            vid: 0,
            currentArticle: {
                id: 0,
                article_could_preview: !1,
                hadSub: !1,
                video_media: {
                    hd: {
                        url: ""
                    },
                    sd: {
                        url: ""
                    }
                },
                autoplay: !1,
                video_total_seconds: 0,
                videoInitialSeconds: 0
            }
        });
    },
    videoListAdapter: function(t) {
        return t.map(function(t) {
            return {
                id: t.id,
                cover: t.article_cover,
                media: t.video_media ? JSON.parse(t.video_media) : "",
                title_cut32: n.cutStr(t.article_title, 32),
                trial: t.article_could_preview,
                totalSecond: t.video_total_seconds || 0,
                played: t.video_play_seconds || 0
            };
        });
    },
    subscribe: function() {
        "course" === this.from ? wx.navigateBack() : wx.navigateTo({
            url: "/pages/courseintro/courseintro?id=" + this.data.data.id
        }), getApp().isLogin() || wx.navigateTo({
            url: "/pages/login/login"
        });
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            title: "" + this.data.data.column_share_title,
            path: "/pages/courseintro/courseintro?id=" + this.data.data.id,
            success: function(e) {
                wx.reportAnalytics("foward_column_success", {
                    column_id: t.data.data.id,
                    column_name: t.data.data.column_title
                });
            },
            fail: function(t) {}
        };
    },
    onNextVideo: function() {
        var t = this.data.currentIndex + 1;
        this.setCurrentIndex(t, !0);
    },
    likeRequesting: !1,
    praiseArticle: function() {
        var e = this;
        if (!getApp().isLogin()) return getApp().navigateToLogin();
        var a = this.data.currentArticle;
        this.likeRequesting || (this.likeRequesting = !0, a.had_liked ? i.unlikeArticle(a.id, "article").then(function(i) {
            var n;
            e.likeRequesting = !1, e.setData((n = {}, t(n, "currentArticle.like_count", a.like_count - 1), 
            t(n, "currentArticle.had_liked", !1), n));
        }).catch(function(t) {
            e.likeRequesting = !1, n.error(t.msg);
        }) : i.likeArticle(a.id, "article").then(function(i) {
            var n;
            e.likeRequesting = !1, e.setData((n = {}, t(n, "currentArticle.like_count", a.like_count + 1), 
            t(n, "currentArticle.had_liked", !0), n));
        }).catch(function(t) {
            e.likeRequesting = !1, n.error(t.msg);
        }));
    },
    commentJump: function() {
        getApp().isLogin() ? wx.navigateTo({
            url: "/pages/comment/comment?id=" + this.data.currentArticle.id + "&type=course"
        }) : getApp().navigateToLogin();
    },
    shareComment: function(t) {
        if (!getApp().isLogin()) return this.gotoLogin();
        var e = t.currentTarget.dataset.data;
        r.openComment("sharecomment", {
            content: e.comment_content,
            nicname: n.subString(e.user_name, 32),
            timestamp: e.comment_ctime,
            ctitle: this.data.data.column_title,
            atitle: this.data.currentArticle.article_title,
            qrurl: "https://time.geekbang.org/course/detail/" + e.cid + "-" + e.aid
        });
    },
    praiseComment: function(e) {
        var n = this;
        if (!getApp().isLogin()) return getApp().navigateToLogin();
        var a = e.currentTarget.dataset.data;
        a.had_liked ? i.unlikeArticle(a.id, "comment").then(function(e) {
            n.data.comments.forEach(function(e, i) {
                if (e.id === a.id) {
                    var r;
                    n.setData((r = {}, t(r, "comments[" + i + "].like_count", n.data.comments[i].like_count - 1), 
                    t(r, "comments[" + i + "].had_liked", !1), r));
                }
            });
        }).catch(function(t) {
            wx.showToast({
                title: t.msg,
                icon: "none"
            });
        }) : i.likeArticle(a.id, "comment").then(function(e) {
            n.data.comments.forEach(function(e, i) {
                if (e.id === a.id) {
                    var r;
                    n.setData((r = {}, t(r, "comments[" + i + "].like_count", n.data.comments[i].like_count + 1), 
                    t(r, "comments[" + i + "].had_liked", !0), r));
                }
            });
        }).catch(function(t) {
            wx.showToast({
                title: t.msg,
                icon: "none"
            });
        });
    },
    selectPayAction: function(t) {
        this.setData({
            showPayAction: !1
        }), "copy" === t.detail && wx.setClipboardData({
            data: "https://time.geekbang.org/course/intro/" + this.data.data.id,
            success: function() {
                wx.showModal({
                    title: "您的支付链接已成功复制",
                    content: "将该链接粘贴至微信或浏览器中打开，即可进入该课程页完成支付",
                    showCancel: !1
                });
            },
            fail: function() {
                return n.error("复制链接失败，请重试");
            }
        }), "saveImg" === t.detail && r.open("pay", {
            title: this.data.data.column_title,
            unit: this.data.data.column_unit,
            price: this.data.data.column_price_format,
            url: "https://time.geekbang.org/course/intro/" + this.data.data.id
        });
    },
    hideReview: function() {
        this.setData({
            showReview: !1
        });
    },
    popupShare: function() {
        this.setData({
            showActionSheet: !0
        });
    },
    selectAction: function(t) {
        this.setData({
            showActionSheet: !1
        }), "shareMoment" === t.detail && (wx.reportAnalytics("click_column_shareimage", {
            column_id: this.data.data.id,
            column_name: this.data.data.column_title
        }), getApp().shareImage(this.data.data.column_poster_wxlite), wx.navigateTo({
            url: "/pages/sharemoment/sharemoment"
        }));
    }
});