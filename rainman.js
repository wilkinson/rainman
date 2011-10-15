//- JavaScript source code

//- rainman.js ~~
//                                                      ~~ (c) SRW, 15 Oct 2011

(function (global) {
    'use strict';

 // Assertions

    if (global.hasOwnProperty('JSON') === false) {
        throw new Error('JSON object is not available.');
    }

 // Declarations

    var cache, define, isFunction, pack, sync, unpack, uuid;

 // Definitions

    cache = {};

    define = function (obj, name, params) {
        if (typeof Object.defineProperty === 'function') {
            define = function (obj, name, params) {
                return Object.defineProperty(obj, name, params);
            };
        } else {
            define = function (obj, name, params) {
                var key;
                for (key in params) {
                    if (params.hasOwnProperty(key) === true) {
                        switch (key) {
                        case 'get':
                            obj.__defineGetter__(name, params[key]);
                            break;
                        case 'set':
                            obj.__defineSetter__(name, params[key]);
                            break;
                        case 'value':
                            delete obj[name];
                            obj[name] = params[key];
                            break;
                        default:
                         // (placeholder)
                        }
                    }
                }
                return obj;
            };
        }
        return define(obj, name, params);
    };

    isFunction = function (f) {
        return ((typeof f === 'function') && (f instanceof Function));
    };

    pack = function (x) {
        return global.JSON.stringify(x, function replacer(key, val) {
            if (isFunction(val)) {
                if (isFunction(val.toJSON)) {
                    return val.toJSON();
                } else if (isFunction(val.toSource)) {
                    return val.toSource();
                } else if (isFunction(val.toString)) {
                    return val.toString();
                } else {
                    return ('' + val);
                }
            } else {
                return global.JSON.stringify(val);
            }
        });
    };

    sync = function (key) {
     // (placeholder for filesystem and database read/write functionality)
    };

    unpack = function (x) {
        return global.JSON.parse(x, function (key, val) {
            return global.JSON.parse(val);
        });
    };

    uuid = function () {
     // This function generates hexadecimal UUIDs of length 32.
        var x = '';
        while (x.length < 32) {
            x += Math.random().toString(16).slice(2, (32 + 2 - x.length));
        }
        return x;
    };

 // Constructors

    function Pair(obj) {
        if ((typeof obj !== 'object') || (obj === null)) {
            obj = {};
        }
        var that = this;
        define(that, 'key', {
            configurable: false,
            enumerable: true,
            value: (obj.hasOwnProperty('key')) ? unpack(pack(obj.key)) : uuid()
        });
        if (cache.hasOwnProperty(that.key) === false) {
            if (obj.hasOwnProperty('val')) {
                cache[that.key] = pack(obj.val);
            } else {
             // Ideally, some "onload" events here would help me check the
             // cloud for data we may be resurrecting from known keys ...
                cache[that.key] = pack(null);
            }
            sync(that.key);
        }
        define(that, 'val', {
            configurable: false,
            enumerable: true,
            get: function () {
                return unpack(cache[that.key]);
            },
            set: function (x) {
                var y = pack(x);
                if (cache[that.key] !== y) {
                    cache[that.key] = y;
                    sync(that.key);
                }
            }
        });
        return that;
    }

 // Invocations

    (function test() {

        var a, b, c, d, puts;

        a = new Pair({key: 'lala'});
        b = new Pair({val: 'lele'});
        c = new Pair({val: b.val});
        d = new Pair(b);

        puts = function () {
            var stringify;
            stringify = function () {
                var i, n, x, y;
                n = arguments.length;
                x = Array.prototype.slice.call(arguments);
                y = [];
                for (i = 0; i < n; i += 1) {
                    y[i] = JSON.stringify(x[i]);
                }
                return y.join('\n');
            }; 
            if (global.hasOwnProperty('console')) {
                puts = function () {
                    global.console.log(stringify.apply(this, arguments));
                };
            } else if (global.hasOwnProperty('print')) {
                puts = function () {
                    global.print(stringify.apply(this, arguments));
                };
            } else {
                throw new Error('The "puts" lazy-load fell through.');
            }
            puts.apply(this, arguments);
        };

        puts(a, b, c, d);

        b.val += 1;

        puts(a, b, c, d);

    }());

    return;

}(function (outer_scope) {
    'use strict';
 // This strict anonymous closure is taken from my Web Chassis project.
    if (this === null) {
        return (typeof global === 'object') ? global : outer_scope;
    } else {
        return (typeof this.global === 'object') ? this.global : this;
    }
}.call(null, this)));

//- vim:set syntax=javascript:
