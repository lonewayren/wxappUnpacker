var n = {};

module.exports = {
    _store: n,
    on: function(o, t) {
        n[o] || (n[o] = []), "function" == typeof t && n[o].push(t);
    },
    remove: function(o, t) {
        if (n[o]) {
            var e = n[o].indexOf(t);
            e > -1 && n[o].splice(e, 1);
        }
    },
    emit: function(o, t) {
        n[o] && n[o].forEach(function(n) {
            n && n(t);
        });
    }
};