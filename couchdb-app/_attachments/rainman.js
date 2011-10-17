//- JavaScript source code

//- rainman.js ~~
//                                                      ~~ (c) SRW, 17 Oct 2011

(function (global) {
    'use strict';

 // Assertions

    if (global.hasOwnProperty('RAINMAN')) {
     // If RAINMAN is already present, avoid extra setup cost.
        return;
    }

 // Declarations

    var isFunction, read, remove, uuid, write;

 // Definitions

    isFunction = function (f) {
        return ((typeof f === 'function') && (f instanceof Function));
    };

    read = function (key) {
        throw new Error('RAINMAN needs a definition for "read".');
    };

    remove = function (key) {
        throw new Error('RAINMAN needs a definition for "remove".');
    };

    uuid = function () {
     // This function generates hexadecimal UUIDs of length 32.
        var x = '';
        while (x.length < 32) {
            x += Math.random().toString(16).slice(2, (32 + 2 - x.length));
        }
        return x;
    };

    write = function (key, val) {
        throw new Error('RAINMAN needs a definition for "write".');
    };

 // Constructors

    global.RAINMAN = function (obj) {
     // NOTE: This function requires initialization before use!
        obj = (obj instanceof Object) ? obj : {};
        switch ((obj.hasOwnProperty('key') ? 2 : 0) +
                (obj.hasOwnProperty('val') ? 1 : 0)) {
        case 1:
         // Only 'val' was specified.
            return write(uuid(), obj.val);
        case 2:
         // Only 'key' was specified.
            return read(obj.key);
        case 3:
         // Both 'key' and 'val' were specified.
            if (obj.val === undefined) {
                return remove(obj.key);
            } else {
                return write(obj.key, obj.val);
            }
        default:
         // Neither a key nor a value was specified.
            throw new Error('RAINMAN expects at least a "key" or a "val"!');
        }
    };

    global.RAINMAN.init = function (obj) {
        obj = (obj instanceof Object) ? obj : {};
        read = (isFunction(obj.read)) ? obj.read : read;
        remove = (isFunction(obj.remove)) ? obj.remove : remove;
        write = (isFunction(obj.write)) ? obj.write : write;
        delete global.RAINMAN.init;
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
