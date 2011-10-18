//- JavaScript source code

//- couchdb-ajax.js ~~
//
//  This file defines a Rainman extension that enables CouchDB as a filesystem
//  using a web browser and non-blocking AJAX calls :-)
//
//  NOTE: Obviously, this isn't going to work very well if the RAINMAN function
//  hasn't loaded in the current environment yet ...
//
//                                                      ~~ (c) SRW, 18 Oct 2011

(function () {
    'use strict';
    /*global RAINMAN: false */

 // Private declarations

    var bookmarks;

 // Private definitions

    bookmarks = {
        doc: function (id) {
         // Yes, this is hardcoded -- I will deal with it later :-P
            return 'http://sean.couchone.com:5984/rainman/' + id;
        }
    };

 // Initialization

    RAINMAN.init({

        read: function (key, exit) {
            var pull = new XMLHttpRequest();
            pull.onreadystatechange = function () {
                var response;
                if (pull.readyState === 4) {
                    response = JSON.parse(pull.responseText);
                    if (pull.status === 200) {
                        exit.success(response.val);
                    } else {
                        exit.failure(pull.statusText);
                    }
                }
            };
            pull.open('GET', bookmarks.doc(key), true);
            pull.send(null);
        },

        remove: function (key, exit) {
            var pull = new XMLHttpRequest();
            pull.onreadystatechange = function () {
                var push, response;
                if (pull.readyState === 4) {
                    switch (pull.status) {
                    case 200:
                        response = JSON.parse(pull.responseText);
                        push = new XMLHttpRequest();
                        push.onreadystatechange = function () {
                            if (push.readyState === 4) {
                                if (push.status === 200) {
                                    exit.success(undefined);
                                } else {
                                    exit.failure(push.statusText);
                                }
                            }
                        };
                        push.open('DELETE', bookmarks.doc(key), true);
                        push.setRequestHeader('If-Match', response._rev);
                        push.send(null);
                        break;
                    case 404:
                        exit.success(undefined);
                        break;
                    default:
                        exit.failure(pull.statusText);
                    }
                }
            };
            pull.open('GET', bookmarks.doc(key), true);
            pull.send(null);
        },

        write: function (key, val, exit) {
            var pull = new XMLHttpRequest();
            pull.onreadystatechange = function () {
                var push, response;
                if (pull.readyState === 4) {
                    switch (pull.status) {
                    case 200:
                        response = JSON.parse(pull.responseText);
                        response.val = val;
                        break;
                    case 404:
                        response = {
                            '_id':  key,
                            'val':  val
                        };
                        break;
                    default:
                        exit.failure(pull.statusText);
                        return;
                    }
                    push = new XMLHttpRequest();
                    push.onreadystatechange = function () {
                        if (push.readyState === 4) {
                            if (push.status === 201) {
                                exit.success(response.val);
                            } else {
                                exit.failure(push.statusText);
                            }
                        }
                    };
                    push.open('PUT', bookmarks.doc(key), true);
                    push.send(JSON.stringify(response));
                }
            };
            pull.open('GET', bookmarks.doc(key), true);
            pull.send(null);
        }

    });

 // That's all, folks!

    return;

}());

(function demo() {
    'use strict';

 // Create a new entry from scratch. Ideally, this will be fixed soon and the
 // annoying "GET 404" error message will no longer appear in the console ...

    var x = RAINMAN({val: [1, 2, 3, 4, 5]});

    x.onerror = function (val, exit) {
        console.error(val);
    };

    x.onready = function (val, exit) {
        console.log('Initial:', val);
        exit.success(val);
    };

    RAINMAN(x).onready = function (val, exit) {
     // Here, we modify it and write it back to server. It's still confusing
     // to me about exactly why it outputs [42, 2, 3, 4, 5], though ... ???
        console.log('Modified:', val);
        val[0] = 42;
        exit.success(val);
    };

    x.onready = function (val, exit) {
     // Since an AVar won't sync until RAINMAN is called, this clones the
     // original value into a new instance of AVar :-)
        RAINMAN({key: x.key}).onready = function (val, exit) {
            console.log('Clone 1:', val);
            exit.success(val);
        };
        exit.success(val);
    };

    RAINMAN(x).onready = function (val, exit) {
     // This clone will match our modified version because it was synced :-)
        RAINMAN({key: x.key}).onready = function (val, exit) {
            console.log('Clone 2:', val);
            exit.success(val);
        };
     // Now, we'll delete the remote reference by "undefining" it :-)
        RAINMAN({key: x.key, val: undefined}).onready = function (val, exit) {
            console.log('Deleted:', x.key);
            exit.success(undefined);
        };
        exit.success(val);
    };

 // THE END :-)

}());

//- vim:set syntax=javascript:
