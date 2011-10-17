//- JavaScript source code

//- couchdb-ajax.js ~~
//
//  This is an example "plugin" for Rainman that enables CouchDB to act as a
//  filesystem using a web browser and synchronous AJAX calls.
//
//                                                      ~~ (c) SRW, 17 Oct 2011

(function () {
    'use strict';

 // Ideally, you would write this with Web Chassis in order to guarantee that
 // the RAINMAN function exists in the current environment, and that would
 // also allow me to use asynchronous variables, as shown in Quanah. As it is,
 // though, I have instead opted to demonstrate with blocking calls here.

    /*global RAINMAN: false */

 // Declarations

    var bookmarks;

 // Definitions

    bookmarks = {
        doc: function (id) {
         // Yes, this is hardcoded -- I will deal with it later :-P
            return 'http://sean.couchone.com:5984/rainman/' + id;
        }
    };

    RAINMAN.init({
        read: function (key) {
            var request = new XMLHttpRequest();
            request.open('GET', bookmarks.doc(key), false);
            request.send(null);
            if (request.status !== 200) {
                throw new Error(request.statusText);
            }
            return {
                key: key,
                val: JSON.parse(request.responseText)
            };
        },
        remove: function (key) {
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
                return;
            default:
                throw new Error(request.statusText);
            }
            request.open('DELETE', bookmarks.doc(key), false);
            request.setRequestHeader('If-Match', temp._rev);
            request.send(null);
            if (request.status !== 200) {
                throw new Error(request.statusText);
            } else {
                console.log('Deleted the doc "' + key + '".');
            }
        },
        write: function (key, val) {
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
                throw new Error(request.statusText);
            }
            request.open('PUT', bookmarks.doc(key), false);
            request.send(JSON.stringify(temp));
            if (request.status !== 201) {
                throw new Error(request.statusText);
            } else {
                console.log(request.responseText);
            }
            return {
                key: key,
                val: temp.val
            };
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
