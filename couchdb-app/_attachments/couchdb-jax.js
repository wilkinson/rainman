//- JavaScript source code

//- couchdb-jax.js ~~
//
//  This file defines a Rainman extension that enables CouchDB as a filesystem
//  using a web browser and AJAX calls. Even though it uses blocking calls, it
//  still works just fine with my "asynchronous variable model" anyway :-)
//
//  NOTE: Obviously, this isn't going to work very well if the RAINMAN function
//  hasn't loaded in the current environment yet ...
//
//                                                      ~~ (c) SRW, 18 Oct 2011

(function () {
    'use strict';
    /*global RAINMAN: false */

 // Private declarations

    var bookmarks, cache, isFunction;

 // Private definitions

    bookmarks = {
        doc: function (id) {
         // Yes, this is hardcoded -- I will deal with it later :-P
            return 'http://sean.couchone.com:5984/rainman/' + id;
        }
    };

    cache = {};                         //- private storage for _id and _rev

    isFunction = function (f) {
        return ((typeof f === 'function') && (f instanceof Function));
    };

 // Initialization

    RAINMAN.init({
        read: function (key, exit) {
            var request = new XMLHttpRequest();
            request.open('GET', bookmarks.doc(key), false);
            request.send(null);
            if (request.status === 200) {
                exit.success(JSON.parse(request.responseText));
            } else {
                exit.failure(request.statusText);
            }
        },
        remove: function (key, exit) {
            var each, request, temp;
            request = new XMLHttpRequest();
            request.open('GET', bookmarks.doc(key), false);
            request.send(null);
            switch (request.status) {
            case 200:
                temp = JSON.parse(request.responseText);
                break;
            case 404:
                console.log('Remote document is missing anyway ...');
                exit.success(undefined);
                return;
            default:
                exit.failure(request.statusText);
                return;
            }
            request.open('DELETE', bookmarks.doc(key), false);
            request.setRequestHeader('If-Match', temp._rev);
            request.send(null);
            if (request.status === 200) {
                console.log('Deleted the doc "' + key + '".');
                exit.success(undefined);
            } else {
                exit.failure(request.statusText);
            }
        },
        write: function (key, val, exit) {
            var each, request, temp;
            request = new XMLHttpRequest();
            request.open('GET', bookmarks.doc(key), false);
            request.send(null);
            switch (request.status) {
            case 200:
                temp = JSON.parse(request.responseText);
                temp.val = val;
                break;
            case 404:
                console.log('Remote document "' + key + '" is missing.');
                temp = {
                    '_id':  key,
                    'val':  val
                };
                break;
            default:
                exit.failure(request.statusText);
                return;
            }
            request.open('PUT', bookmarks.doc(key), false);
            request.send(JSON.stringify(temp));
            if (request.status === 201) {
                console.log(request.responseText);
                exit.success(temp.val);
            } else {
                exit.failure(request.statusText);
            }
        }
    });

 // Demonstrations

    (function () {

        var x, y, z;

     // Create a new entry from scratch.

        x = RAINMAN({val: [1, 2, 3, 4, 5]});

     // Modify it and write it back to server.

        x.val[0] = 42;

        y = RAINMAN(x);

     // Fetch a new copy for fun.

        z = RAINMAN({key: x.key});

     // Delete it from the server.

        RAINMAN({key: x.key, val: undefined});

    }());

 // That's all, folks!

    return;

}());

//- vim:set syntax=javascript:
