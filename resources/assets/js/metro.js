/*!
 * Metro UI CSS v3.0.0 (http://metroui.org.ua)
 * Copyright 2012-2015 Sergey Pimenov
 * Licensed under MIT (http://metroui.org.ua/license.html)
 */
function addTouchEvents(a) {
    hasTouch && (a.addEventListener("touchstart", touch2Mouse, !0), a.addEventListener("touchmove", touch2Mouse, !0), a.addEventListener("touchend", touch2Mouse, !0))
}
function touch2Mouse(a) {
    var b, c = a.changedTouches[0];
    switch (a.type) {
        case"touchstart":
            b = "mousedown";
            break;
        case"touchend":
            b = "mouseup";
            break;
        case"touchmove":
            b = "mousemove";
            break;
        default:
            return
    }
    "mousedown" == b && (eventTimer = (new Date).getTime(), startX = c.clientX, startY = c.clientY, mouseDown = !0), "mouseup" == b && ((new Date).getTime() - eventTimer <= 500 ? b = "click" : (new Date).getTime() - eventTimer > 1e3 && (b = "longclick"), eventTimer = 0, mouseDown = !1), "mousemove" == b && mouseDown && (deltaX = c.clientX - startX, deltaY = c.clientY - startY, moveDirection = deltaX > deltaY ? "horizontal" : "vertical");
    var d = document.createEvent("MouseEvent");
    d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), c.target.dispatchEvent(d), a.preventDefault()
}
if ("undefined" == typeof jQuery)
    throw new Error("Metro's JavaScript requires jQuery");
window.METRO_VERSION = "3.0.0", window.METRO_AUTO_REINIT = !0, window.METRO_LANGUAGE = "en", window.METRO_LOCALE = "EN_en", window.METRO_CURRENT_LOCALE = "en", window.METRO_SHOW_TYPE = "slide", window.METRO_DEBUG = !0, window.canObserveMutation = "MutationObserver"in window, String.prototype.isUrl = function() {
    "use strict";
    var a = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return a.test(this)
}, String.prototype.isColor = function() {
    "use strict";
    return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this)
}, window.uniqueId = function(a) {
    "use strict";
    return(a || "id") + (new Date).getTime()
};
var dateFormat = function() {
    "use strict";
    var a = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, b = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, c = /[^-+\dA-Z]/g, d = function(a, b) {
        for (a = String(a), b = b || 2; a.length < b; )
            a = "0" + a;
        return a
    };
    return function(e, f, g) {
        var h = dateFormat;
        1 !== arguments.length || "[object String]" !== Object.prototype.toString.call(e) || /\d/.test(e) || (f = e, e = void 0), e = e ? new Date(e) : new Date, f = String(h.masks[f] || f || h.masks["default"]), "UTC:" === f.slice(0, 4) && (f = f.slice(4), g = !0);
        var i = window.METRO_CURRENT_LOCALE || "en", j = g ? "getUTC" : "get", k = e[j + "Date"](), l = e[j + "Day"](), m = e[j + "Month"](), n = e[j + "FullYear"](), o = e[j + "Hours"](), p = e[j + "Minutes"](), q = e[j + "Seconds"](), r = e[j + "Milliseconds"](), s = g ? 0 : e.getTimezoneOffset(), t = {d: k, dd: d(k), ddd: window.METRO_LOCALES[i].days[l], dddd: window.METRO_LOCALES[i].days[l + 7], m: m + 1, mm: d(m + 1), mmm: window.METRO_LOCALES[i].months[m], mmmm: window.METRO_LOCALES[i].months[m + 12], yy: String(n).slice(2), yyyy: n, h: o % 12 || 12, hh: d(o % 12 || 12), H: o, HH: d(o), M: p, MM: d(p), s: q, ss: d(q), l: d(r, 3), L: d(r > 99 ? Math.round(r / 10) : r), t: 12 > o ? "a" : "p", tt: 12 > o ? "am" : "pm", T: 12 > o ? "A" : "P", TT: 12 > o ? "AM" : "PM", Z: g ? "UTC" : (String(e).match(b) || [""]).pop().replace(c, ""), o: (s > 0 ? "-" : "+") + d(100 * Math.floor(Math.abs(s) / 60) + Math.abs(s) % 60, 4), S: ["th", "st", "nd", "rd"][k % 10 > 3 ? 0 : (k % 100 - k % 10 !== 10) * k % 10]};
        return f.replace(a, function(a) {
            return a in t ? t[a] : a.slice(1, a.length - 1)
        })
    }
}();
dateFormat.masks = {"default": "ddd mmm dd yyyy HH:MM:ss", shortDate: "m/d/yy", mediumDate: "mmm d, yyyy", longDate: "mmmm d, yyyy", fullDate: "dddd, mmmm d, yyyy", shortTime: "h:MM TT", mediumTime: "h:MM:ss TT", longTime: "h:MM:ss TT Z", isoDate: "yyyy-mm-dd", isoTime: "HH:MM:ss", isoDateTime: "yyyy-mm-dd'T'HH:MM:ss", isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"}, Date.prototype.format = function(a, b) {
    "use strict";
    return dateFormat(this, a, b)
}, function(a) {
    "use strict";
    a.fn.reverse = Array.prototype.reverse, a.Metro = function(b) {
        b = a.extend({}, b)
    }, a.Metro.initWidgets = function() {
        var b;
        b = a("[data-role]"), a.each(b, function() {
            var b = a(this), c = b.data("role").split(/\s*,\s*/);
            c.map(function(c) {
                try {
                    void 0 !== a.fn[c] && a.fn[c].call(b)
                } catch (d) {
                    window.METRO_DEBUG && console.log(d.message, d.stack)
                }
            })
        })
    }
}(jQuery), $(function() {
    "use strict";
    if ($.Metro.initWidgets(), window.METRO_AUTO_REINIT)
        if (window.canObserveMutation) {
            var a, b, c;
            b = {childList: !0, subtree: !0}, c = function(a) {
                a.map(function(a) {
                    if (a.addedNodes)
                        for (var b, c, d, e = 0, f = a.addedNodes.length; f > e; e++)
                            b = $(a.addedNodes[e]), d = b.find("[data-role]"), c = void 0 !== b.data("role") ? $.merge(d, b) : d, c.length && $.each(c, function() {
                                var a = $(this), b = a.data("role").split(/\s*,\s*/);
                                b.map(function(b) {
                                    try {
                                        void 0 !== $.fn[b] && $.fn[b].call(a)
                                    } catch (c) {
                                        window.METRO_DEBUG && console.log(c.message, c.stack)
                                    }
                                })
                            })
                })
            }, a = new MutationObserver(c), a.observe(document, b)
        } else {
            var d, e = $("body").html();
            setInterval(function() {
                d = $("body").html(), e !== d && (e = d, $.Metro.initWidgets())
            }, 100)
        }
}), function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function(a) {
    var b = 0, c = Array.prototype.slice;
    a.cleanData = function(b) {
        return function(c) {
            var d, e, f;
            for (f = 0; null != (e = c[f]); f++)
                try {
                    d = a._data(e, "events"), d && d.remove && a(e).triggerHandler("remove")
                } catch (g) {
                }
            b(c)
        }
    }(a.cleanData), a.widget = function(b, c, d) {
        var e, f, g, h, i = {}, j = b.split(".")[0];
        return b = b.split(".")[1], e = j + "-" + b, d || (d = c, c = a.Widget), a.expr[":"][e.toLowerCase()] = function(b) {
            return!!a.data(b, e)
        }, a[j] = a[j] || {}, f = a[j][b], g = a[j][b] = function(a, b) {
            return this._createWidget ? void(arguments.length && this._createWidget(a, b)) : new g(a, b)
        }, a.extend(g, f, {version: d.version, _proto: a.extend({}, d), _childConstructors: []}), h = new c, h.options = a.widget.extend({}, h.options), a.each(d, function(b, d) {
            return a.isFunction(d) ? void(i[b] = function() {
                var a = function() {
                    return c.prototype[b].apply(this, arguments)
                }, e = function(a) {
                    return c.prototype[b].apply(this, a)
                };
                return function() {
                    var b, c = this._super, f = this._superApply;
                    return this._super = a, this._superApply = e, b = d.apply(this, arguments), this._super = c, this._superApply = f, b
                }
            }()) : void(i[b] = d)
        }), g.prototype = a.widget.extend(h, {widgetEventPrefix: f ? h.widgetEventPrefix || b : b}, i, {constructor: g, namespace: j, widgetName: b, widgetFullName: e}), f ? (a.each(f._childConstructors, function(b, c) {
            var d = c.prototype;
            a.widget(d.namespace + "." + d.widgetName, g, c._proto)
        }), delete f._childConstructors) : c._childConstructors.push(g), a.widget.bridge(b, g), g
    }, a.widget.extend = function(b) {
        for (var d, e, f = c.call(arguments, 1), g = 0, h = f.length; h > g; g++)
            for (d in f[g])
                e = f[g][d], f[g].hasOwnProperty(d) && void 0 !== e && (b[d] = a.isPlainObject(e) ? a.isPlainObject(b[d]) ? a.widget.extend({}, b[d], e) : a.widget.extend({}, e) : e);
        return b
    }, a.widget.bridge = function(b, d) {
        var e = d.prototype.widgetFullName || b;
        a.fn[b] = function(f) {
            var g = "string" == typeof f, h = c.call(arguments, 1), i = this;
            return g ? this.each(function() {
                var c, d = a.data(this, e);
                return"instance" === f ? (i = d, !1) : d ? a.isFunction(d[f]) && "_" !== f.charAt(0) ? (c = d[f].apply(d, h), c !== d && void 0 !== c ? (i = c && c.jquery ? i.pushStack(c.get()) : c, !1) : void 0) : a.error("no such method '" + f + "' for " + b + " widget instance") : a.error("cannot call methods on " + b + " prior to initialization; attempted to call method '" + f + "'")
            }) : (h.length && (f = a.widget.extend.apply(null, [f].concat(h))), this.each(function() {
                var b = a.data(this, e);
                b ? (b.option(f || {}), b._init && b._init()) : a.data(this, e, new d(f, this))
            })), i
        }
    }, a.Widget = function() {
    }, a.Widget._childConstructors = [], a.Widget.prototype = {widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: {disabled: !1, create: null}, _createWidget: function(c, d) {
            d = a(d || this.defaultElement || this)[0], this.element = a(d), this.uuid = b++, this.eventNamespace = "." + this.widgetName + this.uuid, this.bindings = a(), this.hoverable = a(), this.focusable = a(), d !== this && (a.data(d, this.widgetFullName, this), this._on(!0, this.element, {remove: function(a) {
                    a.target === d && this.destroy()
                }}), this.document = a(d.style ? d.ownerDocument : d.document || d), this.window = a(this.document[0].defaultView || this.document[0].parentWindow)), this.options = a.widget.extend({}, this.options, this._getCreateOptions(), c), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init()
        }, _getCreateOptions: a.noop, _getCreateEventData: a.noop, _create: a.noop, _init: a.noop, destroy: function() {
            this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")
        }, _destroy: a.noop, widget: function() {
            return this.element
        }, option: function(b, c) {
            var d, e, f, g = b;
            if (0 === arguments.length)
                return a.widget.extend({}, this.options);
            if ("string" == typeof b)
                if (g = {}, d = b.split("."), b = d.shift(), d.length) {
                    for (e = g[b] = a.widget.extend({}, this.options[b]), f = 0; f < d.length - 1; f++)
                        e[d[f]] = e[d[f]] || {}, e = e[d[f]];
                    if (b = d.pop(), 1 === arguments.length)
                        return void 0 === e[b] ? null : e[b];
                    e[b] = c
                } else {
                    if (1 === arguments.length)
                        return void 0 === this.options[b] ? null : this.options[b];
                    g[b] = c
                }
            return this._setOptions(g), this
        }, _setOptions: function(a) {
            var b;
            for (b in a)
                this._setOption(b, a[b]);
            return this
        }, _setOption: function(a, b) {
            return this.options[a] = b, "disabled" === a && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!b), b && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
        }, enable: function() {
            return this._setOptions({disabled: !1})
        }, disable: function() {
            return this._setOptions({disabled: !0})
        }, _on: function(b, c, d) {
            var e, f = this;
            "boolean" != typeof b && (d = c, c = b, b = !1), d ? (c = e = a(c), this.bindings = this.bindings.add(c)) : (d = c, c = this.element, e = this.widget()), a.each(d, function(d, g) {
                function h() {
                    return b || f.options.disabled !== !0 && !a(this).hasClass("ui-state-disabled") ? ("string" == typeof g ? f[g] : g).apply(f, arguments) : void 0
                }
                "string" != typeof g && (h.guid = g.guid = g.guid || h.guid || a.guid++);
                var i = d.match(/^([\w:-]*)\s*(.*)$/), j = i[1] + f.eventNamespace, k = i[2];
                k ? e.delegate(k, j, h) : c.bind(j, h)
            })
        }, _off: function(b, c) {
            c = (c || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, b.unbind(c).undelegate(c), this.bindings = a(this.bindings.not(b).get()), this.focusable = a(this.focusable.not(b).get()), this.hoverable = a(this.hoverable.not(b).get())
        }, _delay: function(a, b) {
            function c() {
                return("string" == typeof a ? d[a] : a).apply(d, arguments)
            }
            var d = this;
            return setTimeout(c, b || 0)
        }, _hoverable: function(b) {
            this.hoverable = this.hoverable.add(b), this._on(b, {mouseenter: function(b) {
                    a(b.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function(b) {
                    a(b.currentTarget).removeClass("ui-state-hover")
                }})
        }, _focusable: function(b) {
            this.focusable = this.focusable.add(b), this._on(b, {focusin: function(b) {
                    a(b.currentTarget).addClass("ui-state-focus")
                }, focusout: function(b) {
                    a(b.currentTarget).removeClass("ui-state-focus")
                }})
        }, _trigger: function(b, c, d) {
            var e, f, g = this.options[b];
            if (d = d || {}, c = a.Event(c), c.type = (b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b).toLowerCase(), c.target = this.element[0], f = c.originalEvent)
                for (e in f)
                    e in c || (c[e] = f[e]);
            return this.element.trigger(c, d), !(a.isFunction(g) && g.apply(this.element[0], [c].concat(d)) === !1 || c.isDefaultPrevented())
        }}, a.each({show: "fadeIn", hide: "fadeOut"}, function(b, c) {
        a.Widget.prototype["_" + b] = function(d, e, f) {
            "string" == typeof e && (e = {effect: e});
            var g, h = e ? e === !0 || "number" == typeof e ? c : e.effect || c : b;
            e = e || {}, "number" == typeof e && (e = {duration: e}), g = !a.isEmptyObject(e), e.complete = f, e.delay && d.delay(e.delay), g && a.effects && a.effects.effect[h] ? d[b](e) : h !== b && d[h] ? d[h](e.duration, e.easing, f) : d.queue(function(c) {
                a(this)[b](), f && f.call(d[0]), c()
            })
        }
    });
    a.widget
}), jQuery.easing.jswing = jQuery.easing.swing, jQuery.extend(jQuery.easing, {def: "easeOutQuad", swing: function(a, b, c, d, e) {
        return jQuery.easing[jQuery.easing.def](a, b, c, d, e)
    }, easeInQuad: function(a, b, c, d, e) {
        return d * (b /= e) * b + c
    }, easeOutQuad: function(a, b, c, d, e) {
        return-d * (b /= e) * (b - 2) + c
    }, easeInOutQuad: function(a, b, c, d, e) {
        return(b /= e / 2) < 1 ? d / 2 * b * b + c : -d / 2 * (--b * (b - 2) - 1) + c
    }, easeInCubic: function(a, b, c, d, e) {
        return d * (b /= e) * b * b + c
    }, easeOutCubic: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b + 1) + c
    }, easeInOutCubic: function(a, b, c, d, e) {
        return(b /= e / 2) < 1 ? d / 2 * b * b * b + c : d / 2 * ((b -= 2) * b * b + 2) + c
    }, easeInQuart: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b + c
    }, easeOutQuart: function(a, b, c, d, e) {
        return-d * ((b = b / e - 1) * b * b * b - 1) + c
    }, easeInOutQuart: function(a, b, c, d, e) {
        return(b /= e / 2) < 1 ? d / 2 * b * b * b * b + c : -d / 2 * ((b -= 2) * b * b * b - 2) + c
    }, easeInQuint: function(a, b, c, d, e) {
        return d * (b /= e) * b * b * b * b + c
    }, easeOutQuint: function(a, b, c, d, e) {
        return d * ((b = b / e - 1) * b * b * b * b + 1) + c
    }, easeInOutQuint: function(a, b, c, d, e) {
        return(b /= e / 2) < 1 ? d / 2 * b * b * b * b * b + c : d / 2 * ((b -= 2) * b * b * b * b + 2) + c
    }, easeInSine: function(a, b, c, d, e) {
        return-d * Math.cos(b / e * (Math.PI / 2)) + d + c
    }, easeOutSine: function(a, b, c, d, e) {
        return d * Math.sin(b / e * (Math.PI / 2)) + c
    }, easeInOutSine: function(a, b, c, d, e) {
        return-d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
    }, easeInExpo: function(a, b, c, d, e) {
        return 0 == b ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
    }, easeOutExpo: function(a, b, c, d, e) {
        return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
    }, easeInOutExpo: function(a, b, c, d, e) {
        return 0 == b ? c : b == e ? c + d : (b /= e / 2) < 1 ? d / 2 * Math.pow(2, 10 * (b - 1)) + c : d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
    }, easeInCirc: function(a, b, c, d, e) {
        return-d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
    }, easeOutCirc: function(a, b, c, d, e) {
        return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
    }, easeInOutCirc: function(a, b, c, d, e) {
        return(b /= e / 2) < 1 ? -d / 2 * (Math.sqrt(1 - b * b) - 1) + c : d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
    }, easeInElastic: function(a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return-(h * Math.pow(2, 10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g)) + c
    }, easeOutElastic: function(a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (0 == b)
            return c;
        if (1 == (b /= e))
            return c + d;
        if (g || (g = .3 * e), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return h * Math.pow(2, -10 * b) * Math.sin(2 * (b * e - f) * Math.PI / g) + d + c
    }, easeInOutElastic: function(a, b, c, d, e) {
        var f = 1.70158, g = 0, h = d;
        if (0 == b)
            return c;
        if (2 == (b /= e / 2))
            return c + d;
        if (g || (g = .3 * e * 1.5), h < Math.abs(d)) {
            h = d;
            var f = g / 4
        } else
            var f = g / (2 * Math.PI) * Math.asin(d / h);
        return 1 > b ? -.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g) + c : h * Math.pow(2, -10 * (b -= 1)) * Math.sin(2 * (b * e - f) * Math.PI / g) * .5 + d + c
    }, easeInBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), d * (b /= e) * b * ((f + 1) * b - f) + c
    }, easeOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), d * ((b = b / e - 1) * b * ((f + 1) * b + f) + 1) + c
    }, easeInOutBack: function(a, b, c, d, e, f) {
        return void 0 == f && (f = 1.70158), (b /= e / 2) < 1 ? d / 2 * b * b * (((f *= 1.525) + 1) * b - f) + c : d / 2 * ((b -= 2) * b * (((f *= 1.525) + 1) * b + f) + 2) + c
    }, easeInBounce: function(a, b, c, d, e) {
        return d - jQuery.easing.easeOutBounce(a, e - b, 0, d, e) + c
    }, easeOutBounce: function(a, b, c, d, e) {
        return(b /= e) < 1 / 2.75 ? 7.5625 * d * b * b + c : 2 / 2.75 > b ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : 2.5 / 2.75 > b ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
    }, easeInOutBounce: function(a, b, c, d, e) {
        return e / 2 > b ? .5 * jQuery.easing.easeInBounce(a, 2 * b, 0, d, e) + c : .5 * jQuery.easing.easeOutBounce(a, 2 * b - e, 0, d, e) + .5 * d + c
    }}), function(a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a : a(jQuery)
}(function(a) {
    function b(b) {
        var e, f = b || window.event, g = [].slice.call(arguments, 1), h = 0, i = 0, j = 0, k = 0, l = 0;
        return b = a.event.fix(f), b.type = "mousewheel", f.wheelDelta && (h = f.wheelDelta), f.detail && (h = -1 * f.detail), f.deltaY && (j = -1 * f.deltaY, h = j), f.deltaX && (i = f.deltaX, h = -1 * i), void 0 !== f.wheelDeltaY && (j = f.wheelDeltaY), void 0 !== f.wheelDeltaX && (i = -1 * f.wheelDeltaX), k = Math.abs(h), (!c || c > k) && (c = k), l = Math.max(Math.abs(j), Math.abs(i)), (!d || d > l) && (d = l), e = h > 0 ? "floor" : "ceil", h = Math[e](h / c), i = Math[e](i / d), j = Math[e](j / d), g.unshift(b, h, i, j), (a.event.dispatch || a.event.handle).apply(this, g)
    }
    var c, d, e = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"], f = "onwheel"in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"];
    if (a.event.fixHooks)
        for (var g = e.length; g; )
            a.event.fixHooks[e[--g]] = a.event.mouseHooks;
    a.event.special.mousewheel = {setup: function() {
            if (this.addEventListener)
                for (var a = f.length; a; )
                    this.addEventListener(f[--a], b, !1);
            else
                this.onmousewheel = b
        }, teardown: function() {
            if (this.removeEventListener)
                for (var a = f.length; a; )
                    this.removeEventListener(f[--a], b, !1);
            else
                this.onmousewheel = null
        }}, a.fn.extend({mousewheel: function(a) {
            return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
        }, unmousewheel: function(a) {
            return this.unbind("mousewheel", a)
        }})
}), function() {
    function a(a) {
        var b = Array.prototype.slice.call(document.querySelectorAll(a), 0);
        b.forEach(function(a) {
            var b = a.textContent.replace(/^[\r\n]+/, "").replace(/\s+$/g, "");
            if (/^\S/gm.test(b))
                return void(a.textContent = b);
            for (var c, d, e, f = /^[\t ]+/gm, g = 1e3; c = f.exec(b); )
                e = c[0].length, g > e && (g = e, d = c[0]);
            1e3 != g && (a.textContent = b.replace(new RegExp("^" + d, "gm"), ""))
        })
    }
    document.addEventListener("DOMContentLoaded", function() {
        a("pre code, textarea")
    }, !1)
}();
var hasTouch = "ontouchend"in window, eventTimer, moveDirection = "undefined", startX, startY, deltaX, deltaY, mouseDown = !1;
!function(a) {
    "use strict";
    a.widget("metro.accordion", {version: "3.0.0", options: {closeAny: !1, speed: "fast", onFrameOpen: function() {
                return!0
            }, onFrameOpened: function() {
            }, onFrameClose: function() {
                return!0
            }, onFrameClosed: function() {
            }}, init: function() {
            var b = this, c = this.element;
            c.on("click", ".heading", function(c) {
                var d = a(this).parent();
                return d.hasClass("disabled") ? !1 : (d.hasClass("active") ? b._closeFrame(d) : b._openFrame(d), c.preventDefault(), void c.stopPropagation())
            })
        }, _closeAllFrames: function() {
            var b = this, c = this.element.children(".frame.active");
            a.each(c, function() {
                b._closeFrame(a(this))
            })
        }, _openFrame: function(a) {
            var b = this.options, c = a.children(".content");
            if ("string" == typeof b.onFrameOpen) {
                if (!window[b.onFrameOpen](a))
                    return!1
            } else if (!b.onFrameOpen(a))
                return!1;
            b.closeAny && this._closeAllFrames(), c.slideDown(b.speed), a.addClass("active"), "string" == typeof b.onFrameOpened ? window[b.onFrameOpened](a) : b.onFrameOpened(a)
        }, _closeFrame: function(a) {
            var b = this.options, c = a.children(".content");
            if ("string" == typeof b.onFrameClose) {
                if (!window[b.onFrameClose](a))
                    return!1
            } else if (!b.onFrameClose(a))
                return!1;
            c.slideUp(b.speed, function() {
                a.removeClass("active")
            }), "string" == typeof b.onFrameClosed ? window[b.onFrameClosed](a) : b.onFrameClosed(a)
        }, _create: function() {
            var a = this, b = (this.options, this.element);
            this._setOptionsData(), a.init(), b.data("accordion", this)
        }, _setOptionsData: function() {
            var b = this.options;
            a.each(this.element.data(), function(c, d) {
                if (c in b)
                    try {
                        b[c] = a.parseJSON(d)
                    } catch (e) {
                        b[c] = d
                    }
            })
        }, _destroy: function() {
        }, _setOption: function(a, b) {
            this._super("_setOption", a, b)
        }})
}(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.appbar", {version: "3.0.0", options: {}, _create: function() {
                    var b = this.element, c = this.options;
                    a.each(b.data(), function(b, d) {
                        if (b in c)
                            try {
                                c[b] = a.parseJSON(d)
                            } catch (e) {
                                c[b] = d
                            }
                    }), this._initBar(), b.data("appbar", this)
                }, _initBar: function() {
                    var b = this.element, c = (this.options, a(b).find(".app-bar-pull")), d = a(b).find(".app-bar-menu");
                    0 === d.length && c.hide(), c.length > 0 && c.on("click", function(a) {
                        d.slideToggle("fast"), a.preventDefault(), a.stopPropagation()
                    }), d.length > 0 && a(window).resize(function() {
                        var b = window.innerWidth > 0 ? window.innerWidth : screen.width;
                        b > 800 ? a(".app-bar:not(.no-responsive-future) .app-bar-menu").show() : a(".app-bar:not(.no-responsive-future) .app-bar-menu").hide()
                    })
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})
        }(jQuery), function(a) {
    "use strict";
    a.widget("metro.buttonGroup", {version: "3.0.0", options: {groupType: "one-state", buttonStyle: !1, onChange: function() {
                return!0
            }, onChanged: function() {
            }}, _create: function() {
            var b = this.element, c = this.options;
            a.each(b.data(), function(b, d) {
                if (b in c)
                    try {
                        c[b] = a.parseJSON(d)
                    } catch (e) {
                        c[b] = d
                    }
            }), b.hasClass("group-of-buttons") || b.addClass("group-of-buttons");
            for (var d = b.find(".button, .toolbar-button"), e = 0; e < d.length; e++)
                a(d[e]).data("index", e);
            c.buttonStyle !== !1 && d.addClass(c.buttonStyle), b.on("click", ".button, .toolbar-button", function() {
                if ("string" == typeof c.onChange) {
                    if (!window[c.onChange](a(this).data("index"), this))
                        return!1
                } else if (!c.onChange(a(this).data("index"), this))
                    return!1;
                "one-state" === c.groupType ? (d.removeClass("active"), a(this).addClass("active")) : a(this).toggleClass("active"), "string" == typeof c.onChanged ? window[c.onChanged](a(this).data("index"), this) : c.onChanged(a(this).data("index"), this)
            }), b.data("buttonGroup", this)
        }, _destroy: function() {
        }, _setOption: function(a, b) {
            this._super("_setOption", a, b)
        }})
}(jQuery),
        window.METRO_CALENDAR_WEEK_START = 0, window.METRO_LOCALES = {en: {months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], buttons: ["Today", "Clear", "Cancel", "Help", "Prior", "Next", "Finish"]}, fr: {months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre", "Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"], days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"], buttons: ["Aujourd'hui", "Effacer", "Annuler", "Aide", "Précedent", "Suivant", "Fin"]}, nl: {months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December", "Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"], days: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"], buttons: ["Vandaag", "Verwijderen", "Annuleren", "Hulp", "Vorige", "Volgende", "Einde"]}, ua: {months: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень", "Січ", "Лют", "Бер", "Кві", "Тра", "Чер", "Лип", "Сер", "Вер", "Жов", "Лис", "Гру"], days: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], buttons: ["Сьогодні", "Очистити", "Скасувати", "Допомога", "Назад", "Вперед", "Готово"]}, ru: {months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь", "Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"], days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"], buttons: ["Сегодня", "Очистить", "Отменить", "Помощь", "Назад", "Вперед", "Готово"]}, zhCN: {months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "日", "一", "二", "三", "四", "五", "六"], buttons: ["今日", "清除", "Cancel", "Help", "Prior", "Next", "Finish"]}, it: {months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre", "Gen", " Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"], days: ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"], buttons: ["Oggi", "Cancella", "Cancel", "Help", "Prior", "Next", "Finish"]}, de: {months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember", "Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"], days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], buttons: ["Heute", "Zurücksetzen", "Abbrechen", "Hilfe", "Früher", "Später", "Fertig"]}, es: {months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sept", "Oct", "Nov", "Dic"], days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Do", "Lu", "Mar", "Mié", "Jue", "Vi", "Sáb"], buttons: ["Hoy", "Limpiar", "Cancel", "Help", "Prior", "Next", "Finish"]}, pt: {months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"], days: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado", "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"], buttons: ["Hoje", "Limpar", "Cancelar", "Ajuda", "Anterior", "Seguinte", "Terminar"]}, pl: {months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień", "Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"], days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"], buttons: ["Dzisiaj", "Wyczyść", "Anuluj", "Pomoc", "Poprzedni", "Następny", "Koniec"]}, cs: {months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec", "Led", "Ún", "Bř", "Dub", "Kvě", "Če", "Čer", "Srp", "Zá", "Ří", "Li", "Pro"], days: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Ne", "Po", "Út", "St", "Čt", "Pá", "So"], buttons: ["Dnes", "Vyčistit", "Zrušit", "Pomoc", "Předešlý", "Další", "Dokončit"]}},
function(a) {
    "use strict";
    a.widget("metro.dialog", {version: "3.0.0", options: {modal: !1, overlay: !1, overlayColor: "default", type: "default", place: "center", position: "default", content: !1, hide: !1, width: "auto", height: "auto", background: "default", color: "default", closeButton: !1, windowsStyle: !1, _interval: void 0, _overlay: void 0, onDialogOpen: function() {
            }, onDialogClose: function() {
            }}, _create: function() {
            var b = this.element, c = this.options;
            a.each(b.data(), function(b, d) {
                if (b in c)
                    try {
                        c[b] = a.parseJSON(d)
                    } catch (e) {
                        c[b] = d
                    }
            }), c.overlay && this._createOverlay(), this._createDialog(), b.data("dialog", this)
        }, _createOverlay: function() {
            var b = (this.element, this.options), c = a("body").find(".dialog-overlay");
            0 === c.length && (c = a("<div/>").addClass("dialog-overlay")), b.overlayColor && (b.overlayColor.isColor() ? c.css({background: b.overlayColor}) : c.addClass(b.overlayColor)), b._overlay = c
        }, _createDialog: function() {
            var b = this, c = this.element, d = this.options;
            c.addClass("dialog"), "default" !== d.type && c.addClass(d.type), d.windowsStyle && (d.width = "auto", c.css({left: 0, right: 0})), "default" !== d.background && (d.background.isColor() ? c.css({background: d.background}) : c.addClass(d.background)), "default" !== d.color && (d.color.isColor() ? c.css({color: d.color}) : c.addClass(d.color)), c.css({width: d.width, height: d.height}), d.closeButton && a("<span/>").addClass("dialog-close-button").appendTo(c).on("click", function() {
                b.close()
            }), c.hide()
        }, _setPosition: function() {
            var b = this.element, c = this.options, d = b.width(), e = b.height();
            b.css({left: c.windowsStyle === !1 ? (a(window).width() - d) / 2 : 0, top: (a(window).height() - e) / 2})
        }, open: function() {
            var a, b = this, c = this.element, d = this.options;
            this._setPosition(), c.data("opened", !0), d.overlay && (a = d._overlay, a.appendTo("body").show()), c.fadeIn(), "string" == typeof d.onDialogOpen ? window[d.onDialogOpen](c) : d.onDialogOpen(c), d.hide && parseInt(d.hide) > 0 && (d._interval = setTimeout(function() {
                b.close()
            }, parseInt(d.hide)))
        }, close: function() {
            var b = this.element, c = this.options;
            clearInterval(c._interval), c.overlay && a("body").find(".dialog-overlay").remove(), b.data("opened", !1), b.fadeOut(), "string" == typeof c.onDialogClose ? window[c.onDialogClose](b) : c.onDialogClose(b)
        }, _destroy: function() {
        }, _setOption: function(a, b) {
            this._super("_setOption", a, b)
        }})
}(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.dropdown", {version: "3.0.0", options: {effect: window.METRO_SHOW_TYPE, toggleElement: !1, noClose: !1}, _create: function() {
                    var b, c = this, d = this.element, e = this.options, f = this.element, g = this.name, h = this.element.parent();
                    a.each(d.data(), function(b, c) {
                        if (b in e)
                            try {
                                e[b] = a.parseJSON(c)
                            } catch (d) {
                                e[b] = c
                            }
                    }), b = e.toggleElement ? a(e.toggleElement) : h.children(h.children(".dropdown-toggle").length > 0 ? ".dropdown-toggle" : "a:nth-child(1"), void 0 !== METRO_SHOW_TYPE && (this.options.effect = METRO_SHOW_TYPE), b.on("click." + g, function(b) {
                        if (h.siblings(h[0].tagName).removeClass("active-container"), a(".active-container").removeClass("active-container"), "block" !== f.css("display") || f.hasClass("keep-open")) {
                            if (a("[data-role=dropdown]").each(function(b, d) {
                                f.parents("[data-role=dropdown]").is(d) || a(d).hasClass("keep-open") || "block" !== a(d).css("display") || c._close(d)
                            }), f.hasClass("horizontal")) {
                                f.css({visibility: "hidden", display: "block"});
                                var d = a(f.children("li")[0]).outerWidth();
                                f.css({visibility: "visible", display: "none"});
                                var e = f.children("li").length * d + (f.children("li").length - 1);
                                f.css("width", e)
                            }
                            c._open(f), h.addClass("active-container")
                        } else
                            c._close(f);
                        b.preventDefault(), b.stopPropagation()
                    }), e.noClose === !0 && d.on("click", function(a) {
                        a.stopPropagation()
                    }), a(f).find("li.disabled a").on("click", function(a) {
                        a.preventDefault()
                    }), a(document).on("click", function() {
                        a("[data-role=dropdown]").each(function(b, c) {
                            a(c).hasClass("keep-open") || "block" !== a(c).css("display") || a(c).hide()
                        })
                    }), d.data("dropdown", this)
                }, _open: function(b) {
                    switch (this.options.effect) {
                        case"fade":
                            a(b).fadeIn("fast");
                            break;
                        case"slide":
                            a(b).slideDown("fast");
                            break;
                        default:
                            a(b).show()
                    }
                    this._trigger("onOpen", null, b)
                }, _close: function(b) {
                    switch (this.options.effect) {
                        case"fade":
                            a(b).fadeOut("fast");
                            break;
                        case"slide":
                            a(b).slideUp("fast");
                            break;
                        default:
                            a(b).hide()
                    }
                    this._trigger("onClose", null, b)
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})
       }(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.hint", {version: "3.0.0", options: {hintPosition: "auto", hintBackground: "#FFFCC0", hintColor: "#000000", hintMaxSize: 200, hintMode: "default", _hint: void 0}, _create: function() {
                    var b = this, c = (this.element, this.options);
                    this.element.on("mouseenter", function(d) {
                        a(".hint, .hint2").remove(), b.createHint(), c._hint.show(), d.preventDefault()
                    }), this.element.on("mouseleave", function(a) {
                        c._hint.hide().remove(), a.preventDefault()
                    })
                }, createHint: function() {
                    var b, c = this.element, d = c.data("hint").split("|"), e = this.options;
                    if (a.each(c.data(), function(b, c) {
                        if (b in e)
                            try {
                                e[b] = a.parseJSON(c)
                            } catch (d) {
                                e[b] = c
                            }
                    }), "TD" === c[0].tagName || "TH" === c[0].tagName) {
                        var f = a("<div/>").css("display", "inline-block").html(c.html());
                        c.html(f), c = f
                    }
                    var g = d.length > 1 ? d[0] : !1, h = d.length > 1 ? d[1] : d[0];
                    b = a("<div/>").appendTo("body"), b.addClass(2 === e.hintMode ? "hint2" : "hint"), g && a("<div/>").addClass("hint-title").html(g).appendTo(b), a("<div/>").addClass("hint-text").html(h).appendTo(b), b.addClass(e.position), e.hintShadow && b.addClass("shadow"), e.hintBackground && (e.hintBackground.isColor() ? b.css("background-color", e.hintBackground) : b.addClass(e.hintBackground)), e.hintColor && (e.hintColor.isColor() ? b.css("color", e.hintColor) : b.addClass(e.hintColor)), e.hintMaxSize > 0 && b.css({"max-width": e.hintMaxSize}), "top" === e.hintPosition ? (b.addClass("top"), b.css({top: c.offset().top - a(window).scrollTop() - b.outerHeight() - 20, left: 2 === e.hintMode ? c.offset().left + c.outerWidth() / 2 - b.outerWidth() / 2 - a(window).scrollLeft() : c.offset().left - a(window).scrollLeft()})) : "right" === e.hintPosition ? (b.addClass("right"), b.css({top: 2 === e.hintMode ? c.offset().top + c.outerHeight() / 2 - b.outerHeight() / 2 - a(window).scrollTop() - 10 : c.offset().top - 10 - a(window).scrollTop(), left: c.offset().left + c.outerWidth() + 15 - a(window).scrollLeft()})) : "left" === e.hintPosition ? (b.addClass("left"), b.css({top: 2 === e.hintMode ? c.offset().top + c.outerHeight() / 2 - b.outerHeight() / 2 - a(window).scrollTop() - 10 : c.offset().top - 10 - a(window).scrollTop(), left: c.offset().left - b.outerWidth() - 10 - a(window).scrollLeft()})) : (b.addClass("bottom"), b.css({top: c.offset().top - a(window).scrollTop() + c.outerHeight(), left: 2 === e.hintMode ? c.offset().left + c.outerWidth() / 2 - b.outerWidth() / 2 - a(window).scrollLeft() : c.offset().left - a(window).scrollLeft()}), console.log(c.offset().left)), e._hint = b
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})        }(jQuery),
        function(a) {
            "use strict";
            var b = !1, c = [], d = {_container: null, _notify: null, _timer: null, version: "3.0.0", options: {icon: "", caption: "", content: "", shadow: !0, width: "auto", height: "auto", style: !1, position: "right", timeout: 3e3, keepOpen: !1, type: "default"}, init: function(b) {
                    return this.options = a.extend({}, this.options, b), this._build(), this
                }, _build: function() {
                    var d = this, e = this.options;
                    if (this._container = b || a("<div/>").addClass("notify-container").appendTo("body"), b = this._container, "" === e.content || void 0 === e.content)
                        return!1;
                    if (this._notify = a("<div/>").addClass("notify"), "default" !== e.type && this._notify.addClass(e.type), e.shadow && this._notify.addClass("shadow"), e.style && void 0 !== e.style.background && this._notify.css("background-color", e.style.background), e.style && void 0 !== e.style.color && this._notify.css("color", e.style.color), "" !== e.icon) {
                        a(e.icon).addClass("notify-icon").appendTo(this._notify)
                    }
                    "" !== e.caption && void 0 !== e.caption && a("<div/>").addClass("notify-title").html(e.caption).appendTo(this._notify), "" !== e.content && void 0 !== e.content && a("<div/>").addClass("notify-text").html(e.content).appendTo(this._notify);
                    var f = a("<span/>").addClass("notify-closer").appendTo(this._notify);
                    f.on("click", function() {
                        d.close(0)
                    }), "auto" !== e.width && this._notify.css("min-width", e.width), "auto" !== e.height && this._notify.css("min-height", e.height), this._notify.hide().appendTo(this._container).fadeIn("slow"), c.push(this._notify), e.keepOpen || this.close(e.timeout)
                }, close: function(a) {
                    var b = this;
                    return void 0 === a ? this._hide() : (setTimeout(function() {
                        b._hide()
                    }, a), this)
                }, _hide: function() {
                    var b = this;
                    return void 0 !== this._notify ? (this._notify.fadeOut("slow", function() {
                        a(this).remove(), c.splice(c.indexOf(b._notify), 1)
                    }), this) : !1
                }, closeAll: function() {
                    return c.forEach(function(a) {
                        a.hide("slow", function() {
                            a.remove(), c.splice(c.indexOf(a), 1)
                        })
                    }), this
                }};
            a.Notify = function(a) {
                return Object.create(d).init(a)
            }, a.Notify.show = function(b, c, d) {
                return a.Notify({content: b, caption: c, icon: d})
            }
        }(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.widget", {version: "3.0.0", options: {someValue: null}, _create: function() {
                    var b = this.element, c = this.options;
                    a.each(b.data(), function(b, d) {
                        if (b in c)
                            try {
                                c[b] = a.parseJSON(d)
                            } catch (e) {
                                c[b] = d
                            }
                    }), b.data("widget", this)
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
               }})
        }(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.preloader", {version: "3.0.0", options: {type: "ring", style: "light"}, _create: function() {
                    var b = this.element, c = this.options;
                    a.each(b.data(), function(b, d) {
                        if (b in c)
                            try {
                                c[b] = a.parseJSON(d)
                            } catch (e) {
                                c[b] = d
                            }
                    }), this._createStructure(), b.data("preloader", this)
                }, _createRing: function() {
                    {
                        var b, c, d, e = this.element;
                        this.options
                    }
                    for (b = 0; 5 > b; b++)
                        c = a("<div/>").addClass("wrap").appendTo(e), d = a("<div/>").addClass("circle").appendTo(c)
                }, _createMetro: function() {
                    {
                        var b, c, d = this.element;
                        this.options
                    }
                    for (b = 0; 5 > b; b++)
                        c = a("<div/>").addClass("circle").appendTo(d)
                }, _createStructure: function() {
                    var a = this.element, b = this.options;
                    switch (a.addClass("preloader-" + b.type), "light" !== b.style && a.addClass(b.style + "-style"), a.html(""), b.type) {
                        case"ring":
                            this._createRing();
                            break;
                        case"metro":
                            this._createMetro()
                    }
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})
        }(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.presenter", {version: "3.0.0", options: {someValue: null}, _create: function() {
                    var b = this.element, c = this.options;
                    a.each(b.data(), function(b, d) {
                        if (b in c)
                            try {
                                c[b] = a.parseJSON(d);

                            } catch (e) {
                                c[b] = d
                            }
                    }), b.data("presenter", this)
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})
       }(jQuery),
        function(a) {
            "use strict";
            a.widget("metro.tabControl", {version: "3.0.0", options: {openTarget: !1, saveState: !1, onTabClick: function() {
                        return!0
                    }, onTabChanged: function() {
                    }, _current: {tab: !1, frame: !1}}, _create: function() {
                    {
                        var b, c, d, e = this.element, f = this.options, g = e.children(".tabs").find("li").children("a");
                        e.children(".frames").children("div")
                    }
                    if (a.each(e.data(), function(b, c) {
                        if (b in f)
                            try {
                                f[b] = a.parseJSON(c)
                            } catch (d) {
                                f[b] = c
                            }
                    }), f.saveState && void 0 !== e.attr("id") && "" !== e.attr("id").trim()) {
                        var h = window.localStorage.getItem(e.attr("id") + "-stored-tab");
                        h && "undefined" !== h && (b = e.find("a[href='" + h + "']"), b && (c = b.attr("href"), d = c && c.isUrl() ? !1 : a(c), f._current.tab = b, f._current.frame = d))
                    }
                    if (f._current.tab || f.openTarget === !1 || (b = e.find("a[href='" + f.openTarget + "']"), b && (c = b.attr("href"), d = c && c.isUrl() ? !1 : a(c), f._current.tab = b, f._current.frame = d)), f._current.tab || a.each(g, function(b, c) {
                        var d = a(c), e = d.attr("href"), g = e.isUrl() ? !1 : a(e);
                        d.parent().hasClass("active") && !d.parent().hasClass("disabled") && g !== !1 && (f._current.tab = d, f._current.frame = g)
                    }), !f._current.tab)
                        for (var i = 0; i < g.length; i++)
                            if (!a(g[i]).attr("href").isUrl() && !a(g[i]).parent().hasClass("disabled")) {
                                f._current.tab = a(g[i]), f._current.frame = a(a(g[i]).attr("href"));
                                break
                            }
                    this._createEvents(), this._openTab(), e.data("tabControl", this)
                }, _hideTabs: function() {
                    var b = this.element, c = b.outerWidth(), d = b.children(".tabs").find("li:not(.non-visible-tabs)"), e = b.children(".tabs").find(".non-visible-tabs").children(".d-menu");
                    a.each(d, function() {
                        var b = a(this), d = this;
                        if (d.offsetLeft + d.offsetWidth + 30 > c) {
                            var f = b.clone(!0);
                            f.appendTo(e), b.remove()
                        }
                    })
                }, _openTab: function() {
                    var a = this.element, b = this.options, c = a.children(".tabs").find("li").children("a"), d = a.children(".frames").children("div");
                    c.parent().removeClass("active"), d.hide(), b._current.tab.parent().addClass("active"), b._current.frame.show(), b.saveState && void 0 !== a.attr("id") && "" !== a.attr("id").trim() && window.localStorage.setItem(a.attr("id") + "-stored-tab", b._current.tab.attr("href"))
                }, _createEvents: function() {
                    {
                        var b = this, c = this.element, d = this.options;
                        c.children(".tabs").find("li").children("a"), c.children(".frames").children("div")
                    }
                    c.on("click", ".tabs > li > a", function(c) {
                        var e = a(this), f = e.attr("href"), g = a(f);
                        if (e.parent().hasClass("disabled"))
                            return!1;
                        if ("string" == typeof d.onTabClick) {
                            if (!window[d.onTabClick](e))
                                return!1
                        } else if (!d.onTabClick(e))
                            return!1;
                        return f.isUrl() ? (window.location.href = f, !0) : (d._current.tab = e, d._current.frame = g, b._openTab(), "string" == typeof d.onTabChanged ? window[d.onTabChanged](e) : d.onTabChanged(e), c.preventDefault(), void c.stopPropagation())
                    })
                }, hideTab: function() {
                }, showTab: function() {
                }, _destroy: function() {
                }, _setOption: function(a, b) {
                    this._super("_setOption", a, b)
                }})
        }(jQuery);