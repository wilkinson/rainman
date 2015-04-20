README
======

The focus here is to find a potential "universal API" for a data storage
abstraction at its lowest level. It will adapt itself to a particular JS
environment and provide a portable synchronization mechanism that can target
various backends, beginning with CouchDB. No associations between data are
stored because this is intended to be a "lowest common denominator" of
key-value stores; it will hopefully lend itself well to a variety of query
models.

Did you note, though, that I did _not_ use the word "browser"? JS runs in a
variety of environments, but persistent storage is a tough nut to crack. This
project is closely related to my other main projects, Quanah and Web Chassis :-)

Try it [here](http://sean.couchone.com:5984/rainman/_design/rainman/index.html).

