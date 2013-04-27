# NBLOG

Simple Blog CMS using Mongoose, Express and EJS.

## Installation

    $ npm install nblog

or via Github

    $ git clone git://github.com/astalker/nblog.git
    $ cd nblog
    $ npm install

## Usage

To configure NBlog add the following to your main script. For your local environment (dev) you can specify a plain username and password however on production it is advisable to use environment variables. 

    var nblog = require('nblog');
    params = {
        config: {
            project: 'My Project',
            public: '/../public',
            per_page: '10'
        },
        dev: {
            user: 'user',
            pass: 'password',
            port: '3000',
            db:   'mongodb://localhost/articles'
        },
        prod: {
            user: process.env.NBLOG_USER,
            pass: process.env.NBLOG_PASSWORD,
            db:   process.env.NBLOG_DB
        }
    }
    nblog.init(params);

## Features

  * Add, edit and delete articles. Meta content included for some basic SEO.
  * Articles displayed in a blog layout with links to each article.
  * Article urls automatically built based on date and the alias.
  * Add, edit and delete content pages.
  * Additional content pages displayed in the main nav.
  * Google sitemap generation.
  * Twitter Bootstrap implemented.

## Requirements

MongoDB is required and should be running before starting Nblog.

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
