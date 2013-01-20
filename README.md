
# NBLOG

Simple Blog CMS using Mongoose, Express and EJS.

## Installation

    $ npm install nblog

## Usage

Add the following to your main script and specify your login details for the Admin.

    var nblog = require('nblog');
    params = {
        dev: {
            user: 'user',
            pass: 'password',
            port: '3000',
            db:   'mongodb://localhost/articles',
            public: '/../public'
            },
        prod: {
            user: '',
            pass: '',
            db:   '',
            public: '/../public'
            }
    }
    nblog.init(params);

The public path is relative to the module so to use a public dir in the root you would specify /../../../public
Nblog requires Mongo DB so make sure to start it before running your App.

## Features

  * Add, edit and delete articles
  * Articles displayed in a blog layout with links to each article
  * Urls built based on date and alias

## License 

(The MIT License)

Copyright (c) 2013 Alasdair Stalker alasdair@asta.org.uk

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
