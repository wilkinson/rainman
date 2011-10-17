//- JavaScript source code

//- demo.js ~~
//                                                      ~~ (c) SRW, 17 Oct 2011

(function main(global) {
    'use strict';

    var a, b, c, d, puts;

 // NOTE: I need to test a function as a 'val' property ...

  /*
    a = new Pair({key: 'lala'});
    b = new Pair({val: 'lele'});
    c = new Pair({val: b.val});
    d = new Pair(b);
  */

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

  /*
    b.val += 1;

    puts(a);
    puts(b);
    puts(c);
    puts(d);
  */

 // Initialization ...

    global.RAINMAN({
        add: function (x) {
            puts('add:', x);            //- placeholder: filesystem 'delete'
        },
        rm: function (x) {
            puts('rm:', x);             //- placeholder: filesystem 'delete'
        },
        sync: function (x) {
            puts('sync:', x);           //- placeholder: filesystem I/O
        }
    });

 // Invocation

    global.RAINMAN({rm: ['hello', 'world'], sync: ['lala', 'lele']});

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
