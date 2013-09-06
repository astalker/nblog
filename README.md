# NBLOG

Simple Blog CMS using Mongoose, Express and EJS.

## Installation

```bash
npm install nblog
```

or via Github

```bash
git clone git://github.com/astalker/nblog.git
cd nblog
npm install
```

## Requirements

MongoDB is required and should be running before starting NBlog.

## Usage

To configure NBlog add the following to your main script. For your local environment (dev) you can specify a plain username and password however on production it is advisable to use environment variables.

    var nblog = require('nblog');
    var params = {
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
    };
    nblog.init(params);

The sitemap is available at sitemap.xml. The template files are located in nblog/views and the javascript and stylesheets are in the nblog/public directory.

## Path

The public path for the Javascript and Css is within the Nblog dir but you can override this in the params. Setting public_path: true will use a public dir in your app root. This is useful is you wish to to use your own JS and CSS and not worry about it being overridden when Nblog is updated.

    var params = {
        public_path: true
        ...
    }

## Tests

Unit tests are written using Jasmine. Run them automatically using the Grunt task (from within the Nblog directory). The Grunt task will watch for file changes in the test and lib directories.

```bash
grunt watch
```

or run the tests manually

```bash
jasmine-node test/spec
```

## Features

  * Add, edit and delete articles. Meta content included for some basic SEO.
  * Articles displayed in a blog layout with links to each article.
  * Article urls automatically built based on date and the alias.
  * Add, edit and delete content pages.
  * Additional content pages displayed in the main nav.
  * Google sitemap generation.
  * Twitter Bootstrap implemented.
