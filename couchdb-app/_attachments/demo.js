//- JavaScript source code

//- demo.js ~~
//                                                      ~~ (c) SRW, 17 Oct 2011

(function main(global) {
    'use strict';

    var puts;

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
            return y.join(' ');
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

 // Initialization ...

    global.RAINMAN.init({
        read: function (key) {
            puts('read:', key);
        },
        remove: function (key) {
            puts('remove:', key);
        },
        write: function (key, val) {
            puts('write:', key, val);
        }
    });

 // Invocation

    global.RAINMAN({key: 'hello'});
    global.RAINMAN({val: 'world'});
    global.RAINMAN({key: 'lala', val: 'lele'});
    global.RAINMAN({key: 'lala', val: undefined});

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
