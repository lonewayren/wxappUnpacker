function e(e, r, s) {
    return r in e ? Object.defineProperty(e, r, {
        value: s,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[r] = s, e;
}

function r(i) {
    var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "./", o = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [], l = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, c = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 10;
    return l > c ? o : (t.readdirSync(a).forEach(function(u) {
        if (!(i.indexOf(u) > -1)) {
            var d = t.statSync(s.join(a, u));
            if (d.isDirectory() || u.match(/\.scss$/)) {
                var f = u.split(".scss")[0];
                d.isDirectory() ? o = r(i, "" + a + u + "/", o, l + 1, c) : o.push({
                    entry: e({}, f, "" + a + u),
                    output: {
                        path: s.resolve(__dirname, a),
                        filename: "[name].wxss"
                    },
                    module: {
                        rules: [ {
                            test: /\.scss$/,
                            use: n.extract({
                                use: [ {
                                    loader: "css-loader",
                                    options: {
                                        url: !1
                                    }
                                }, "sass-loader" ],
                                fallback: "style-loader"
                            })
                        } ]
                    },
                    plugins: [ new n({
                        filename: "[name].wxss"
                    }) ],
                    watch: "dev" === process.env.NODE_ENV
                });
            }
        }
    }), o);
}

var s = require("path"), t = require("fs"), n = require("extract-text-webpack-plugin"), i = [ ".git", "node_modules", "iconfont", "assets", "helper", "doc" ];

module.exports = r(i);