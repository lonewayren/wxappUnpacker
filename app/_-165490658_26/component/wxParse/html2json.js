function e(e) {
    for (var t = {}, s = e.split(","), r = 0; r < s.length; r++) t[s[r]] = !0;
    return t;
}

function t(e) {
    return e.replace(/<\?xml.*\?>\n/, "").replace(/<.*!doctype.*\>\n/, "").replace(/<.*!DOCTYPE.*\>\n/, "");
}

var s = "https", r = require("./wxDiscode.js"), n = require("./htmlparser.js"), a = e("br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video"), o = e("abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

module.exports = {
    html2json: function(e, i) {
        e = t(e), e = r.strDiscode(e);
        var d = [], l = {
            nodes: [],
            images: [],
            imageUrls: []
        };
        return n(e, {
            start: function(e, t, r) {
                var n = {
                    node: "element",
                    tag: e,
                    styleStr: ""
                };
                if (0 === d.length) n.index = "" + l.nodes.length; else {
                    var c = d[0];
                    n.parentTag = c.tag, void 0 === c.nodes && (c.nodes = []), n.index = c.index + "." + c.nodes.length, 
                    n.selfIndex = c.nodes.length;
                }
                if (a[e] ? n.tagType = "block" : o[e] && (n.tagType = "inline"), 0 !== t.length && (n.attr = t.reduce(function(e, t) {
                    var s = t.name, r = t.value;
                    return "class" == s && (n.classStr = r), "style" == s && (n.styleStr = r), r.match(/ /) && (r = r.split(" ")), 
                    e[s] ? Array.isArray(e[s]) ? e[s].push(r) : e[s] = [ e[s], r ] : e[s] = r, e;
                }, {})), "li" === n.tag && c && "ol" === c.tag && c.attr && c.attr.start && (n.startIndex = Number(c.attr.start)), 
                "img" === n.tag) {
                    n.imgIndex = l.images.length;
                    var u = n.attr.src;
                    "" == u[0] && u.splice(0, 1), /^\/\//.test(u) && (u = s + ":" + u), n.attr.src = u, 
                    n.from = i, l.images.push(n), l.imageUrls.push(u);
                }
                "source" === n.tag && (l.source = n.attr.src), r ? (void 0 === (c = d[0] || l).nodes && (c.nodes = []), 
                c.nodes.push(n)) : d.unshift(n);
            },
            end: function(e) {
                var t = d.shift();
                if (t.tag !== e && console.error("invalid state: mismatch end tag"), "video" === t.tag && l.source && (t.attr.src = l.source, 
                delete l.source), 0 === d.length) l.nodes.push(t); else {
                    var s = d[0];
                    void 0 === s.nodes && (s.nodes = []), s.nodes.push(t);
                }
            },
            chars: function(e) {
                if (e) {
                    var t = {
                        node: "text",
                        text: r.strcharacterDiscode(e)
                    };
                    if (0 === d.length) t.index = "" + l.nodes.length, l.nodes.push(t); else {
                        var s = d[0];
                        "ol" === s.tag && e.match(/^[\s]+$/) || (void 0 === s.nodes && (s.nodes = []), t.index = s.index + "." + s.nodes.length, 
                        s.nodes.push(t));
                    }
                }
            },
            comment: function(e) {}
        }), l;
    }
};