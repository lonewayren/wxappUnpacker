var e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
    return typeof e;
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};

!function(n) {
    "object" == ("undefined" == typeof exports ? "undefined" : e(exports)) && "undefined" != typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define([], n) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).pingpp = n();
}(function() {
    return function e(n, t, r) {
        function i(o, l) {
            if (!t[o]) {
                if (!n[o]) {
                    var c = "function" == typeof require && require;
                    if (!l && c) return c(o, !0);
                    if (a) return a(o, !0);
                    var u = new Error("Cannot find module '" + o + "'");
                    throw u.code = "MODULE_NOT_FOUND", u;
                }
                var d = t[o] = {
                    exports: {}
                };
                n[o][0].call(d.exports, function(e) {
                    return i(n[o][1][e] || e);
                }, d, d.exports, e, n, t, r);
            }
            return t[o].exports;
        }
        for (var a = "function" == typeof require && require, o = 0; o < r.length; o++) i(r[o]);
        return i;
    }({
        1: [ function(e, n, t) {
            var r = e("./payment_elements.js");
            n.exports = {
                userCallback: void 0,
                urlReturnCallback: void 0,
                urlReturnChannels: [ "alipay_pc_direct" ],
                innerCallback: function(e, n) {
                    "function" == typeof this.userCallback && (void 0 === n && (n = this.error()), this.userCallback(e, n), 
                    this.userCallback = void 0, r.clear());
                },
                error: function(e, n) {
                    return {
                        msg: e = void 0 === e ? "" : e,
                        extra: n = void 0 === n ? "" : n
                    };
                },
                triggerUrlReturnCallback: function(e, n) {
                    "function" == typeof this.urlReturnCallback && this.urlReturnCallback(e, n);
                },
                shouldReturnUrlByCallback: function(e) {
                    return "function" == typeof this.urlReturnCallback && -1 !== this.urlReturnChannels.indexOf(e);
                }
            };
        }, {
            "./payment_elements.js": 8
        } ],
        2: [ function(e, n, t) {
            var r = e("../stash"), i = e("../callbacks"), a = {}.hasOwnProperty;
            n.exports = {
                handleCharge: function(e) {
                    for (var n = e.credential[e.channel], t = [ "appId", "timeStamp", "nonceStr", "package", "signType", "paySign" ], o = 0; o < t.length; o++) if (!a.call(n, t[o])) return void i.innerCallback("fail", i.error("invalid_credential", "missing_field_" + t[o]));
                    r.jsApiParameters = n, this.callpay();
                },
                wxLiteEnabled: function() {
                    return "undefined" != typeof wx && wx.requestPayment;
                },
                callpay: function() {
                    if (this.wxLiteEnabled()) {
                        var e = r.jsApiParameters;
                        delete e.appId, e.complete = function(e) {
                            "requestPayment:ok" === e.errMsg && i.innerCallback("success"), "requestPayment:cancel" === e.errMsg && i.innerCallback("cancel", i.error("用户取消支付")), 
                            "undefined" !== e.err_code && "undefined" !== e.err_desc && i.innerCallback("fail", i.error(e.err_desc, e));
                        }, wx.requestPayment(e);
                    } else console.log("请在微信小程序中打开");
                },
                runTestMode: function(e) {
                    wx.showModal({
                        title: "提示",
                        content: '因 "微信小程序" 限制 域名的原因 暂不支持 模拟付款 请使用 livekey 获取 charge 进行支付'
                    });
                }
            };
        }, {
            "../callbacks": 1,
            "../stash": 9
        } ],
        3: [ function(e, n, t) {
            var r = e("./utils"), i = e("./stash"), a = e("./libs/md5"), o = {
                seperator: "###",
                limit: 1,
                report_url: "https://statistics.pingxx.com/one_stats",
                timeout: 100
            }, l = function(e, n) {
                var t = new RegExp("(^|&)" + n + "=([^&]*)(&|$)", "i"), r = e.substr(0).match(t);
                return null !== r ? unescape(r[2]) : null;
            };
            o.store = function(e) {
                if ("undefined" != typeof localStorage && null !== localStorage) {
                    var n = {};
                    n.app_id = e.app_id || i.app_id || "app_not_defined", n.ch_id = e.ch_id || "", n.channel = e.channel || "", 
                    n.type = e.type || "", n.user_agent = navigator.userAgent, n.host = window.location.host, 
                    n.time = new Date().getTime(), n.puid = i.puid;
                    var t = "app_id=" + n.app_id + "&channel=" + n.channel + "&ch_id=" + n.ch_id + "&host=" + n.host + "&time=" + n.time + "&type=" + n.type + "&user_agent=" + n.user_agent + "&puid=" + n.puid, r = t;
                    null !== localStorage.getItem("PPP_ONE_STATS") && 0 !== localStorage.getItem("PPP_ONE_STATS").length && (r = localStorage.getItem("PPP_ONE_STATS") + this.seperator + t);
                    try {
                        localStorage.setItem("PPP_ONE_STATS", r);
                    } catch (e) {}
                }
            }, o.send = function() {
                if ("undefined" != typeof localStorage && null !== localStorage) {
                    var e = this, n = localStorage.getItem("PPP_ONE_STATS");
                    if (!(null === n || n.split(e.seperator).length < e.limit)) try {
                        for (var t = [], i = n.split(e.seperator), o = a(i.join("&")), c = 0; c < i.length; c++) t.push({
                            app_id: l(i[c], "app_id"),
                            channel: l(i[c], "channel"),
                            ch_id: l(i[c], "ch_id"),
                            host: l(i[c], "host"),
                            time: l(i[c], "time"),
                            type: l(i[c], "type"),
                            user_agent: l(i[c], "user_agent"),
                            puid: l(i[c], "puid")
                        });
                        r.request(e.report_url, "POST", t, function(e, n) {
                            200 == n && localStorage.removeItem("PPP_ONE_STATS");
                        }, void 0, {
                            "X-Pingpp-Report-Token": o
                        });
                    } catch (e) {}
                }
            }, o.report = function(e) {
                var n = this;
                n.store(e), setTimeout(function() {
                    n.send();
                }, n.timeout);
            }, n.exports = o;
        }, {
            "./libs/md5": 5,
            "./stash": 9,
            "./utils": 11
        } ],
        4: [ function(e, n, t) {
            var r = e("./stash"), i = e("./utils"), a = e("./collection");
            n.exports = {
                SRC_URL: "https://cookie.pingxx.com",
                init: function() {
                    var e = this;
                    i.documentReady(function() {
                        try {
                            e.initPuid();
                        } catch (e) {}
                    });
                },
                initPuid: function() {
                    if ("undefined" != typeof window && "undefined" != typeof localStorage && null !== localStorage) {
                        var e = localStorage.getItem("pingpp_uid");
                        if (null === e) {
                            e = i.randomString();
                            try {
                                localStorage.setItem("pingpp_uid", e);
                            } catch (e) {}
                        }
                        if (r.puid = e, !document.getElementById("p_analyse_iframe")) {
                            var n;
                            try {
                                n = document.createElement("iframe");
                            } catch (e) {
                                n = document.createElement('<iframe name="ifr"></iframe>');
                            }
                            n.id = "p_analyse_iframe", n.src = this.SRC_URL + "/?puid=" + e, n.style.display = "none", 
                            document.body.appendChild(n);
                        }
                        setTimeout(function() {
                            a.send();
                        }, 0);
                    }
                }
            };
        }, {
            "./collection": 3,
            "./stash": 9,
            "./utils": 11
        } ],
        5: [ function(e, n, t) {
            !function() {
                function e(e, n) {
                    var t = (65535 & e) + (65535 & n);
                    return (e >> 16) + (n >> 16) + (t >> 16) << 16 | 65535 & t;
                }
                function t(n, t, r, i, a, o) {
                    return e((l = e(e(t, n), e(i, o))) << (c = a) | l >>> 32 - c, r);
                    var l, c;
                }
                function r(e, n, r, i, a, o, l) {
                    return t(n & r | ~n & i, e, n, a, o, l);
                }
                function i(e, n, r, i, a, o, l) {
                    return t(n & i | r & ~i, e, n, a, o, l);
                }
                function a(e, n, r, i, a, o, l) {
                    return t(n ^ r ^ i, e, n, a, o, l);
                }
                function o(e, n, r, i, a, o, l) {
                    return t(r ^ (n | ~i), e, n, a, o, l);
                }
                function l(n, t) {
                    var l, c, u, d, s;
                    n[t >> 5] |= 128 << t % 32, n[14 + (t + 64 >>> 9 << 4)] = t;
                    var f = 1732584193, p = -271733879, h = -1732584194, m = 271733878;
                    for (l = 0; l < n.length; l += 16) c = f, u = p, d = h, s = m, p = o(p = o(p = o(p = o(p = a(p = a(p = a(p = a(p = i(p = i(p = i(p = i(p = r(p = r(p = r(p = r(p, h = r(h, m = r(m, f = r(f, p, h, m, n[l], 7, -680876936), p, h, n[l + 1], 12, -389564586), f, p, n[l + 2], 17, 606105819), m, f, n[l + 3], 22, -1044525330), h = r(h, m = r(m, f = r(f, p, h, m, n[l + 4], 7, -176418897), p, h, n[l + 5], 12, 1200080426), f, p, n[l + 6], 17, -1473231341), m, f, n[l + 7], 22, -45705983), h = r(h, m = r(m, f = r(f, p, h, m, n[l + 8], 7, 1770035416), p, h, n[l + 9], 12, -1958414417), f, p, n[l + 10], 17, -42063), m, f, n[l + 11], 22, -1990404162), h = r(h, m = r(m, f = r(f, p, h, m, n[l + 12], 7, 1804603682), p, h, n[l + 13], 12, -40341101), f, p, n[l + 14], 17, -1502002290), m, f, n[l + 15], 22, 1236535329), h = i(h, m = i(m, f = i(f, p, h, m, n[l + 1], 5, -165796510), p, h, n[l + 6], 9, -1069501632), f, p, n[l + 11], 14, 643717713), m, f, n[l], 20, -373897302), h = i(h, m = i(m, f = i(f, p, h, m, n[l + 5], 5, -701558691), p, h, n[l + 10], 9, 38016083), f, p, n[l + 15], 14, -660478335), m, f, n[l + 4], 20, -405537848), h = i(h, m = i(m, f = i(f, p, h, m, n[l + 9], 5, 568446438), p, h, n[l + 14], 9, -1019803690), f, p, n[l + 3], 14, -187363961), m, f, n[l + 8], 20, 1163531501), h = i(h, m = i(m, f = i(f, p, h, m, n[l + 13], 5, -1444681467), p, h, n[l + 2], 9, -51403784), f, p, n[l + 7], 14, 1735328473), m, f, n[l + 12], 20, -1926607734), h = a(h, m = a(m, f = a(f, p, h, m, n[l + 5], 4, -378558), p, h, n[l + 8], 11, -2022574463), f, p, n[l + 11], 16, 1839030562), m, f, n[l + 14], 23, -35309556), h = a(h, m = a(m, f = a(f, p, h, m, n[l + 1], 4, -1530992060), p, h, n[l + 4], 11, 1272893353), f, p, n[l + 7], 16, -155497632), m, f, n[l + 10], 23, -1094730640), h = a(h, m = a(m, f = a(f, p, h, m, n[l + 13], 4, 681279174), p, h, n[l], 11, -358537222), f, p, n[l + 3], 16, -722521979), m, f, n[l + 6], 23, 76029189), h = a(h, m = a(m, f = a(f, p, h, m, n[l + 9], 4, -640364487), p, h, n[l + 12], 11, -421815835), f, p, n[l + 15], 16, 530742520), m, f, n[l + 2], 23, -995338651), h = o(h, m = o(m, f = o(f, p, h, m, n[l], 6, -198630844), p, h, n[l + 7], 10, 1126891415), f, p, n[l + 14], 15, -1416354905), m, f, n[l + 5], 21, -57434055), h = o(h, m = o(m, f = o(f, p, h, m, n[l + 12], 6, 1700485571), p, h, n[l + 3], 10, -1894986606), f, p, n[l + 10], 15, -1051523), m, f, n[l + 1], 21, -2054922799), h = o(h, m = o(m, f = o(f, p, h, m, n[l + 8], 6, 1873313359), p, h, n[l + 15], 10, -30611744), f, p, n[l + 6], 15, -1560198380), m, f, n[l + 13], 21, 1309151649), h = o(h, m = o(m, f = o(f, p, h, m, n[l + 4], 6, -145523070), p, h, n[l + 11], 10, -1120210379), f, p, n[l + 2], 15, 718787259), m, f, n[l + 9], 21, -343485551), 
                    f = e(f, c), p = e(p, u), h = e(h, d), m = e(m, s);
                    return [ f, p, h, m ];
                }
                function c(e) {
                    var n, t = "";
                    for (n = 0; n < 32 * e.length; n += 8) t += String.fromCharCode(e[n >> 5] >>> n % 32 & 255);
                    return t;
                }
                function u(e) {
                    var n, t = [];
                    for (t[(e.length >> 2) - 1] = void 0, n = 0; n < t.length; n += 1) t[n] = 0;
                    for (n = 0; n < 8 * e.length; n += 8) t[n >> 5] |= (255 & e.charCodeAt(n / 8)) << n % 32;
                    return t;
                }
                function d(e) {
                    var n, t, r = "0123456789abcdef", i = "";
                    for (t = 0; t < e.length; t += 1) n = e.charCodeAt(t), i += r.charAt(n >>> 4 & 15) + r.charAt(15 & n);
                    return i;
                }
                function s(e) {
                    return unescape(encodeURIComponent(e));
                }
                function f(e) {
                    return c(l(u(n = s(e)), 8 * n.length));
                    var n;
                }
                function p(e, n) {
                    return function(e, n) {
                        var t, r, i = u(e), a = [], o = [];
                        for (a[15] = o[15] = void 0, i.length > 16 && (i = l(i, 8 * e.length)), t = 0; t < 16; t += 1) a[t] = 909522486 ^ i[t], 
                        o[t] = 1549556828 ^ i[t];
                        return r = l(a.concat(u(n)), 512 + 8 * n.length), c(l(o.concat(r), 640));
                    }(s(e), s(n));
                }
                n.exports = function(e, n, t) {
                    return n ? t ? p(n, e) : d(p(n, e)) : t ? f(e) : d(f(e));
                };
            }();
        }, {} ],
        6: [ function(n, t, r) {
            var i = n("./version").v, a = {}.hasOwnProperty, o = function() {
                n("./init").init();
            };
            o.prototype.version = i, t.exports = new o();
            var l = n("./testmode"), c = n("./callbacks"), u = n("./mods"), d = n("./stash"), s = n("./collection"), f = n("./payment_elements");
            o.prototype.createPayment = function(n, t, r, i) {
                if ("function" == typeof t && (c.userCallback = t), f.init(n), a.call(f, "id")) if (a.call(f, "channel")) {
                    a.call(f, "app") && ("string" == typeof f.app ? d.app_id = f.app : "object" == e(f.app) && "string" == typeof f.app.id && (d.app_id = f.app.id)), 
                    s.report({
                        type: d.type || "pure_sdk_click",
                        channel: f.channel,
                        ch_id: f.id
                    });
                    var o = f.channel;
                    if (a.call(f, "credential")) if (f.credential) if (a.call(f.credential, o)) if (a.call(f, "livemode")) {
                        var p = u.getChannelModule(o);
                        if (void 0 === p) return console.error('channel module "' + o + '" is undefined'), 
                        void c.innerCallback("fail", c.error("invalid_channel", 'channel module "' + o + '" is undefined'));
                        !1 !== f.livemode ? (void 0 !== r && (d.signature = r), "boolean" == typeof i && (d.debug = i), 
                        p.handleCharge(f)) : a.call(p, "runTestMode") ? p.runTestMode(f) : l.runTestMode(f);
                    } else c.innerCallback("fail", c.error("invalid_charge", "no_livemode_field")); else c.innerCallback("fail", c.error("invalid_credential", "credential_is_incorrect")); else c.innerCallback("fail", c.error("invalid_credential", "credential_is_undefined")); else c.innerCallback("fail", c.error("invalid_charge", "no_credential"));
                } else c.innerCallback("fail", c.error("invalid_charge", "no_channel")); else c.innerCallback("fail", c.error("invalid_charge", "no_charge_id"));
            }, o.prototype.setAPURL = function(e) {
                d.APURL = e;
            }, o.prototype.setUrlReturnCallback = function(e, n) {
                if ("function" != typeof e) throw "callback need to be a function";
                if (c.urlReturnCallback = e, void 0 !== n) {
                    if (!Array.isArray(n)) throw "channels need to be an array";
                    c.urlReturnChannels = n;
                }
            };
        }, {
            "./callbacks": 1,
            "./collection": 3,
            "./init": 4,
            "./mods": 7,
            "./payment_elements": 8,
            "./stash": 9,
            "./testmode": 10,
            "./version": 12
        } ],
        7: [ function(e, n, t) {
            var r = {}.hasOwnProperty, i = {};
            n.exports = i, i.channels = {
                wx_lite: e("./channels/wx_lite")
            }, i.extras = {}, i.getChannelModule = function(e) {
                if (r.call(i.channels, e)) return i.channels[e];
            }, i.getExtraModule = function(e) {
                if (r.call(i.extras, e)) return i.extras[e];
            };
        }, {
            "./channels/wx_lite": 2
        } ],
        8: [ function(e, n, t) {
            var r = e("./callbacks"), i = {}.hasOwnProperty;
            n.exports = {
                id: null,
                or_id: null,
                channel: null,
                app: null,
                credential: {},
                extra: null,
                livemode: null,
                order_no: null,
                time_expire: null,
                init: function(e) {
                    var n;
                    if ("string" == typeof e) try {
                        n = JSON.parse(e);
                    } catch (e) {
                        return void r.innerCallback("fail", r.error("json_decode_fail", e));
                    } else n = e;
                    if (void 0 !== n) {
                        if (i.call(n, "object") && "order" == n.object) {
                            n.or_id = n.id, n.order_no = n.merchant_order_no;
                            var t = n.charge_essentials;
                            if (n.channel = t.channel, n.credential = t.credential, n.extra = t.extra, i.call(n, "charge") && null != n.charge) n.id = n.charge; else if (i.call(t, "id") && null != t.id) n.id = t.id; else if (i.call(n, "charges")) for (var a = 0; a < n.charges.data.length; a++) if (n.charges.data[a].channel === t.channel) {
                                n.id = n.charges.data[a].id;
                                break;
                            }
                        } else i.call(n, "object") && "recharge" == n.object && (n = n.charge);
                        for (var o in this) i.call(n, o) && (this[o] = n[o]);
                        return this;
                    }
                    r.innerCallback("fail", r.error("json_decode_fail"));
                },
                clear: function() {
                    for (var e in this) "function" != typeof this[e] && (this[e] = null);
                }
            };
        }, {
            "./callbacks": 1
        } ],
        9: [ function(e, n, t) {
            n.exports = {};
        }, {} ],
        10: [ function(e, n, t) {
            var r = e("./utils"), i = {}.hasOwnProperty;
            n.exports = {
                PINGPP_MOCK_URL: "http://sissi.pingxx.com/mock.php",
                runTestMode: function(e) {
                    var n = {
                        ch_id: e.id,
                        scheme: "http",
                        channel: e.channel
                    };
                    i.call(e, "order_no") ? n.order_no = e.order_no : i.call(e, "orderNo") && (n.order_no = e.orderNo), 
                    i.call(e, "time_expire") ? n.time_expire = e.time_expire : i.call(e, "timeExpire") && (n.time_expire = e.timeExpire), 
                    i.call(e, "extra") && (n.extra = encodeURIComponent(JSON.stringify(e.extra))), r.redirectTo(this.PINGPP_MOCK_URL + "?" + r.stringifyData(n), e.channel);
                }
            };
        }, {
            "./utils": 11
        } ],
        11: [ function(n, t, r) {
            var i = n("./callbacks"), a = {}.hasOwnProperty, o = t.exports = {
                stringifyData: function(e, n, t) {
                    void 0 === t && (t = !1);
                    var r = [];
                    for (var i in e) a.call(e, i) && "function" != typeof e[i] && ("bfb_wap" == n && "url" == i || "yeepay_wap" == n && "mode" == i || "channel_url" != i && r.push(i + "=" + (t ? encodeURIComponent(e[i]) : e[i])));
                    return r.join("&");
                },
                request: function(n, t, r, i, l, c) {
                    if ("undefined" != typeof XMLHttpRequest) {
                        var u = new XMLHttpRequest();
                        if (void 0 !== u.timeout && (u.timeout = 6e3), "GET" === (t = t.toUpperCase()) && "object" == (void 0 === r ? "undefined" : e(r)) && r && (n += "?" + o.stringifyData(r, "", !0)), 
                        u.open(t, n, !0), void 0 !== c) for (var d in c) a.call(c, d) && u.setRequestHeader(d, c[d]);
                        "POST" === t ? (u.setRequestHeader("Content-type", "application/json; charset=utf-8"), 
                        u.send(JSON.stringify(r))) : u.send(), void 0 === i && (i = function() {}), void 0 === l && (l = function() {}), 
                        u.onreadystatechange = function() {
                            4 == u.readyState && i(u.responseText, u.status, u);
                        }, u.onerror = function(e) {
                            l(u, 0, e);
                        };
                    } else console.log("Function XMLHttpRequest is undefined.");
                },
                formSubmit: function(e, n, t) {
                    if ("undefined" != typeof window) {
                        var r = document.createElement("form");
                        r.setAttribute("method", n), r.setAttribute("action", e);
                        for (var i in t) if (a.call(t, i)) {
                            var o = document.createElement("input");
                            o.setAttribute("type", "hidden"), o.setAttribute("name", i), o.setAttribute("value", t[i]), 
                            r.appendChild(o);
                        }
                        document.body.appendChild(r), r.submit();
                    } else console.log("Not a browser, form submit url: " + e);
                },
                randomString: function(e) {
                    void 0 === e && (e = 32);
                    for (var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = n.length, r = "", i = 0; i < e; i++) r += n.charAt(Math.floor(Math.random() * t));
                    return r;
                },
                redirectTo: function(e, n) {
                    i.shouldReturnUrlByCallback(n) ? i.triggerUrlReturnCallback(null, e) : "undefined" != typeof window ? window.location.href = e : console.log("Not a browser, redirect url: " + e);
                },
                inWeixin: function() {
                    return "undefined" != typeof navigator && -1 !== navigator.userAgent.toLowerCase().indexOf("micromessenger");
                },
                inAlipay: function() {
                    return "undefined" != typeof navigator && -1 !== navigator.userAgent.toLowerCase().indexOf("alipayclient");
                },
                documentReady: function(e) {
                    "undefined" != typeof document ? "loading" != document.readyState ? e() : document.addEventListener("DOMContentLoaded", e) : e();
                },
                loadUrlJs: function(e, n, t) {
                    var r = document.getElementsByTagName("head")[0], i = null;
                    null == document.getElementById(e) ? ((i = document.createElement("script")).setAttribute("type", "text/javascript"), 
                    i.setAttribute("src", n), i.setAttribute("id", e), i.async = !0, null != t && (i.onload = i.onreadystatechange = function() {
                        if (i.ready) return !1;
                        i.readyState && "loaded" != i.readyState && "complete" != i.readyState || (i.ready = !0, 
                        t());
                    }), r.appendChild(i)) : null != t && t();
                }
            };
        }, {
            "./callbacks": 1
        } ],
        12: [ function(e, n, t) {
            n.exports = {
                v: "2.2.1"
            };
        }, {} ]
    }, {}, [ 6 ])(6);
});