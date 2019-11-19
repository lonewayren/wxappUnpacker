function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var t = e(require("../config/index.js")), r = e(require("../utils/requestzeus.js")), u = {}, a = {};

module.exports = {
    syncStudyProgress: function(e, u) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/article/progress/store",
            data: {
                article_id: e,
                video_play_seconds: u
            }
        });
    },
    getShareSalePoster: function(e) {
        var u = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).isSku ? {
            sku: e
        } : {
            cid: e
        };
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/my/sharesale/poster",
            data: u
        });
    },
    getShareSalePosterData: function(e) {
        var u = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).isSku ? {
            sku: e
        } : {
            cid: e
        };
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/column/sharesale",
            data: u
        });
    },
    getColumnInfo: function(e) {
        var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, i = a.isSku ? {
            sku: e
        } : {
            cid: e
        };
        return i.with_groupbuy = !0, new Promise(function(l, n) {
            a.cache && e === u.id ? l(u) : (0, r.default)({
                url: t.default.timeServer + "/serv/v1/column/intro",
                data: i
            }).then(function(e) {
                u = e, l(e);
            }).catch(function(e) {
                return n(e);
            });
        });
    },
    getGrouponInfo: function(e) {
        var u = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return new Promise(function(i, l) {
            u.cache && a.groupbuy && a.groupbuy.code === e ? i(a) : (0, r.default)({
                url: t.default.timeServer + "/serv/v1/groupbuy/info",
                data: {
                    code: e
                }
            }).then(function(e) {
                a = e, i(e);
            }).catch(function(e) {
                return l(e);
            });
        });
    },
    getNewUpdate: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/column/articles/latest",
            data: {
                cid: e
            }
        });
    },
    getColumns: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
        return (0, r.default)({
            url: t.default.timeServer + "/serv/wxlite/v1/columns",
            data: {
                column_type: e
            }
        });
    },
    getArticlePreview: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/wxlite/v1/article/share",
            data: {
                id: e
            }
        });
    },
    getArticles: function(e, u, a, i) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/column/articles",
            data: {
                cid: e,
                size: i || 20,
                prev: u,
                order: a,
                sample: !1
            }
        });
    },
    getAudios: function(e, u, a, i) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/column/audios",
            data: {
                cid: e,
                size: i || 20,
                prev: u,
                order: a
            }
        });
    },
    getArticle: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/article",
            data: {
                id: e
            }
        });
    },
    getArticleComments: function(e, u, a) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/comments",
            data: {
                aid: e,
                size: a || 20,
                prev: u || 0
            }
        });
    },
    likeArticle: function(e, u, a) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/like/store",
            data: {
                like_obj_id: e,
                like_obj: u,
                source: a
            }
        });
    },
    unlikeArticle: function(e, u, a) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/like/destroy",
            data: {
                like_obj_id: e,
                like_obj: u,
                source: a
            }
        });
    },
    commentArticle: function(e, u, a) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/comment/store",
            data: {
                aid: e,
                comment_content: u,
                source: a
            }
        });
    },
    shareforbook: function(e) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/wxlite/v1/column/shareforbook",
            data: {
                cid: e
            }
        });
    },
    getMyBoughtAll: function() {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/my/products/all"
        });
    },
    getMyBoughtTabData: function(e, u, a) {
        return (0, r.default)({
            url: t.default.timeServer + "/serv/v1/my/products/list",
            data: {
                nav_id: e,
                size: a || 20,
                prev: u || 0
            }
        });
    }
};