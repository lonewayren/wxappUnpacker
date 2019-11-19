function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var r = e(require("../config/index.js")), t = e(require("../utils/requestzeus.js"));

module.exports = {
    getExplore: function() {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/wxlite/v1/explore/all"
        });
    },
    getExplore_all: function(e) {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/wxlite/v1/explore/all"
        });
    },
    getBlockListData: function(e) {
        return (0, t.default)({
            url: r.default.timeServer + "/serv/wxlite/v1/explore",
            data: e
        });
    }
};