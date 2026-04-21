export var isObject = function (obj) {
    return typeof obj == 'object' && !!obj;
};

export var mix = function (r, s, ov, wl, merge) {
    var i;
    var l;
    var p;

    if (wl && wl.length) {
        for (i = 0, l = wl.length; i < l; ++i) {
            p = wl[i];
            if (Object.prototype.hasOwnProperty.call(s, p)) {
                if (merge && isObject(r[p])) {
                    mix(r[p], s[p]);
                } else if (ov || !(p in r)) {
                    r[p] = s[p];
                }
            }
        }
    } else {
        for (i in s) {
            if (Object.prototype.hasOwnProperty.call(s, i)) {
                if (merge && isObject(r[i])) {
                    mix(r[i], s[i], ov, wl, true);
                } else if (ov || !(i in r)) {
                    r[i] = s[i];
                }
            }
        }
    }
    return r;
};

export var merge = function () {
    var a = arguments;
    var o = {};
    var i = 0;
    var l = a.length;

    for (; i < l; i++) {
        mix(o, a[i], true);
    }
    return o;
};

export var extend = function (r, s, px, sx) {
    if (!s || !r) {
        return r;
    }

    var OP = Object.prototype;
    var sp = s.prototype;
    var rp = Object.create(sp);
    r.prototype = rp;
    rp.constructor = r;
    r.superclass = sp;

    // assign constructor property
    if (s !== Object && sp.constructor === OP.constructor) {
        sp.constructor = s;
    }

    // add prototype overrides
    if (px) {
        mix(rp, px, true);
    }

    // add object overrides
    if (sx) {
        mix(r, sx, true);
    }

    return r;
};

export var omit = function () {
    var obj = arguments[0];
    var keys = [].slice.call(arguments, 1);
    var filter = typeof keys[0] == 'function' ? keys[0] : null;
    var clone = merge({}, obj);

    if (filter) {
        Object.keys(clone).forEach((key) => {
            if (filter(key)) {
                delete clone[key];
            }
        });
    } else {
        keys.forEach(function (key) {
            delete clone[key];
        });
    }
    return clone;
};
