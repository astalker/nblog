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

## Tests

Unit tests are written with the Mocha Test Framework and the Should BDD Assertion library. Run them automatically using the Grunt task (from within the NBlog directory). The Grunt task will watch for file changes in the test and lib directories.

```bash
grunt watch
```

or run the tests manually

```bash
mocha test/spec
```

## Features

  * Add, edit and delete articles. Meta content included for some basic SEO.
  * Articles displayed in a blog layout with links to each article.
  * Article urls automatically built based on date and the alias.
  * Add, edit and delete content pages.
  * Additional content pages displayed in the main nav.
  * Google sitemap generation.
  * Twitter Bootstrap implemented.
