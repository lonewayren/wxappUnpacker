function e(e, t) {
    n.type = e, n.data = t;
}

function t() {
    var e;
    try {
        e = require("./lib/" + n.type);
    } catch (e) {
        return null;
    }
    return e;
}

var n = {
    type: "reward",
    data: {}
};

module.exports = {
    open: function(t, n) {
        e(t, n), wx.navigateTo({
            url: "/pages/shareimg/shareimg"
        });
    },
    openComment: function(t, n) {
        e(t, n), wx.navigateTo({
            url: "/pages/sharecomment/sharecomment"
        });
    },
    draw: function(e, r) {
        var a = t();
        return a ? a.draw(e, n.data, r) : new Promise(function(e, t) {
            t();
        });
    },
    getSize: function(e) {
        var r = t();
        return r ? r.getSize(n.data, e) : {};
    },
    getInfo: function() {
        var e = t();
        return e ? e.getInfo() : {};
    }
};