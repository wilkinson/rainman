//- JavaScript source code

//- rainman.js ~~
//                                                      ~~ (c) SRW, 15 Oct 2011

(function (global) {
    'use strict';

 // Assertions

    if (global.hasOwnProperty('RAINMAN')) {
     // If RAINMAN is already present, avoid extra setup cost.
        return;
    }

    if (global.hasOwnProperty('JSON') === false) {
     // Checking for native JSON _should_ be a thing of the past, but ...
        throw new Error('JSON object is not available.');
    }

 // Declarations

    var cache, define, isFunction, pack, unpack, uuid;

 // Definitions

    cache = {};

    define = function (obj, name, params) {
        if (isFunction(Object.defineProperty)) {
            define = function (obj, name, params) {
                return Object.defineProperty(obj, name, params);
            };
        } else {
            define = function (obj, name, params) {
                /*jslint nomen: true */
                params = (params instanceof Object) ? params : {};
                var key;
                for (key in params) {
                    if (params.hasOwnProperty(key)) {
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
        return JSON.stringify(x, function replacer(key, val) {
            if (isFunction(val)) {
             // NOTE: This is still just a placeholder!
                if (isFunction(val.toJSON)) {
                    return val.toJSON();
                } else if (isFunction(val.toSource)) {
                    return val.toSource();
                } else {
                    return val.toString();
                }
            } else {
                return JSON.stringify(val);
            }
        });
    };

    unpack = function (x) {
        return JSON.parse(x, function (key, val) {
         // NOTE: This is still just a placeholder!
            return JSON.parse(val);
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
        obj = (obj instanceof Object) ? obj : {};
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
             // sync(that.key);         //- ???
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
                    //sync(that.key);   //- ???
                }
            }
        });
        return that;
    }

 // Global definitions

    global.RAINMAN = function (init) {
     // NOTE: This function requires "platform-specific" initialization!
        init = (init instanceof Object) ? init : {};
        var add, rm, sync;
        if (isFunction(init.add)) {
            add = init.add;
        } else {
            throw new Error('RAINMAN needs a definition for "add".');
        }
        if (isFunction(init.rm)) {
            rm = init.rm;
        } else {
            throw new Error('RAINMAN needs a definition for "rm".');
        }
        if (isFunction(init.sync)) {
            sync = init.sync;
        } else {
            throw new Error('RAINMAN needs a definition for "sync".');
        }
        global.RAINMAN = function (obj) {
            obj = (obj instanceof Object) ? obj : {};
            if (obj.hasOwnProperty('rm')) {
                rm(obj.rm);
            }
            if (obj.hasOwnProperty('sync')) {
                sync(obj.sync);
            }
        };
    };

 // That's all, folks!

    return;

}(function (outer_scope) {
    'use strict';
 // This strict anonymous closure is taken from my Web Chassis project.
    /*global global: true */
    if (this === null) {
        return (typeof global === 'object') ? global : outer_scope;
    } else {
        return (typeof this.global === 'object') ? this.global : this;
    }
}.call(null, this)));

//- vim:set syntax=javascript:
