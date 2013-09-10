var db = require('./db'),
  util    = require('util'),
  moment = require('moment'),
  Crypto = require('crypto'),
  helper = require('./helper'),
  sitemap = require('./sitemap'),
  server = require('./server'),
  render = require('./render');

/**
 * Starts the App.
 *
 * @param {Object} params the params
 * @api public
 */
exports.init = function(params) {
  var app;
  if (params.public_path) {
    params.path = '/../../../public';
  } else {
    params.path = '/../public';
  }

  server.init(params, function(express, error) {
    if (error) {
      console.log(error);
      return false;
    }
    app = express;
  });
  require('./routes')(app, this, render);
  helper.init(server);
};

/**
 * Close DB connection.
 *
 * @api public
 */
exports.close = function() {
  db.disconnect(function(err) { });
};

/**
 * Starts the App.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @param {Function} function to call on success
 * @api public
 */
exports.checkAccess = function(req, res, next) {
  if (server.checkLoggedIn(req, res)) {
    next();
  } else {
    res.redirect('/login');
  }
};

/**
 * Render the Index page, get the preferences and articles for the homepage.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.index = function(req, res) {
  var c, next;
  exports.nextArticles(req, res, 1, function(n) {
    next=n;
  });
  helper.prefs(function(prefs) {
    db.articles(prefs.settings.items, function(err, articles) {
      render.index(err, articles, req, res, next);
    });
  });
};

/**
 * Render a specific article.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.page = function(req, res) {
  var next;
  exports.nextArticles(req, res, req.params.p, function(n) {
      next = n;
  });
  helper.prefs(function(prefs) {
    db.allArticlesPaged(prefs.settings.items, req.params.p, function(error, articles) {
      render.articlesPaged(error, articles, next, req, res);
    });
  });
};

/**
 * Render a specific page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.content = function(req, res) {
  db.findPageByAlias(req.params.c, function(error, content) {
    if (error) {
      render.error(error, req, res);
    }
    else {
      render.page(content, req, res);
    }
  });
};

/**
 * Render the articles page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.articles = function(req, res) {
  db.allArticles(function(error, articles) {
    render.articles(error, articles, req, res);
  });
};

/**
 * On login form post.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.loginpost = function(req, res) {
  res.cookie('user', Crypto.createHmac('SHA256', req.body.username).update('string').digest('base64'));
  res.cookie('pass', Crypto.createHmac('SHA256', req.body.password).update('string').digest('base64'));
  res.redirect('/admin?login=1');
};

/**
 * On logout.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.logout = function(req, res) {
  res.cookie('user', '');
  res.cookie('pass', '');
  res.redirect('/');
};

/**
 * On article Add form post.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpost = function(req, res) {
  if (req.body.title === '' || req.body.description === '' || req.body.ts === '')
    throw 'Please enter the title, description and date';

  if (req.body.alias === '')
    req.body.alias = req.body.title.replace(/ /g, '-').toLowerCase();

  db.add(
    req.body.title,
    req.body.ts,
    req.body.article,
    req.body.description,
    req.body.keywords,
    req.body.alias,
    function(error) {
        if (error) throw error;
        res.redirect('/admin?add=1');
    });
};

/**
 * On page form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpagepost = function(req, res) {
  if (req.body.page === '')
    throw error;

  db.addpage(
    req.body.page,
    req.body.ts,
    req.body.intro,
    req.body.content,
    req.body.description,
    req.body.keywords,
    req.body.alias,
    req.body.menu,
    function(error) {
      if (error) throw error;
      res.redirect('/admin?addp=1');
    });
};

/**
 * Render the admin page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.admin = function(req, res) {
  var c, getlastlog = req.query["login"];

  helper.prefs(function(prefs) {
    db.allArticlesPages(100000, function(err, articles, pages) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else {
        var msg = null;
        if (req.query["edit"])
          msg = 'Article updated';
        else if (req.query["add"])
          msg = 'Article added';
        else if (req.query["pref"])
          msg = 'Settings saved';
        else if (req.query["del"])
          msg = 'Article deleted';
        else if (req.query["addp"])
          msg = 'Page added';
        else if (req.query["editp"])
          msg = 'Page updated';
        else if (req.query["del-page"])
          msg = 'Page deleted';
        else if (req.query["login"])
          msg = prefs.msg;

        var del_id = null;
        if (req.query["confirm"])
          del_id = req.query["confirm"];
        var del_page_id = null;
        if (req.query["confirm-page"])
          del_page_id = req.query["confirm-page"];

        c = {
          title: "Admin",
          articles: articles,
          pages: pages,
          flash: msg,
          delete_notice: del_id,
          delete_page_notice: del_page_id
        };
        res.render('admin', data(req, res, prefs, c));
      }
    });
  }, getlastlog);
};

/**
 * Render the article edit page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.edit = function(req, res) {
  db.findArticleById(req.query['id'], function(error, article) {
    render.edit(error, article, req, res);
  });
};

/**
 * Render a single article.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.article = function(req, res) {
  var p = req.params;
  var start = end = new Date(p.year, p.month-1, p.day);   //months are 0 based so Jan equals 0
  db.findArticleByDate(start, end, p.title, function(error, article) {
    if (error) {
      render.error(error, req, res);
    }
    else {
      render.article(article, req, res);
    }
  });
};

/**
 * On article edit form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.editpost = function(req, res) {
  db.edit(
    req.body.id,
    req.body.title,
    req.body.ts,
    req.body.article,
    req.body.description,
    req.body.keywords,
    req.body.alias,
    function(error) {
      if (error) throw error;
      res.redirect('/admin?edit=1');
    });
};

/**
 * On article delete form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.del = function(req, res) {
  res.redirect('/admin?confirm='+req.query["id"]);
};

/**
 * On article delete form submission confirmation.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.delconfirm = function(req, res) {
  db.delete(req.query["id"],
    function(error) {
      if (error) throw error;
      res.redirect('/admin?del=1');
    });
};

/**
 * On page delete form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.delpage = function(req, res) {
  res.redirect('/admin?confirm-page=' + req.query["id"]);
};

/**
 * On page delete form submission confirmation.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.delpageconfirm = function(req, res) {
  db.deletePage(req.query["id"],
    function(error) {
      if (error) throw error;
      res.redirect('/admin?del-page=1');
    });
};

/**
 * Get the next page for pagination.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @param {Number} the current page
 * @param {Function} callback function
 * @api public
 */
nextArticles = exports.nextArticles = function(req, res, page, callback) {
  helper.prefs(function(prefs) {
    db.countArticles(function (err, num) {
      if (Number(num) > (Number(page) * prefs.settings.items)) {
          callback(Number(page) + 1);
      } else {
          callback(0);
      }
    });
  });
};

/**
 * On preferences edit form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.save = function(req, res) {
  db.save(
    req.body.name,
    req.body.email,
    req.body.items,
    req.body.description,
    req.body.keywords,
    req.body.gravatar,
    function(error) {
      if (error) throw error;
      res.redirect('/admin?pref=1');
    });
};

/**
 * Render the edit page form.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.editpage = function(req, res) {
  db.findPageById(req.query['id'], function(error, page) {
    render.editpage(error, page, req, res);
  });
};
/**
 * On page edit form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.editpagepost = function(req, res) {
  db.editpage(
    req.body.id,
    req.body.page,
    req.body.ts,
    req.body.intro,
    req.body.content,
    req.body.description,
    req.body.keywords,
    req.body.alias,
    req.body.menu,
    function(error) {
      if (error) throw error;
      res.redirect('/admin?editp=1');
    }
  );
};

/**
 * Render the Google sitemap xml.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.sitemap = function(req, res) {
  var host = 'http://'+req.headers.host;
  sitemap.create(host, function (sitemap) {
    res.setHeader("Content-Type", "text/xml");
    res.render('sitemap', {
      sitemap: sitemap
    });
  });
};

/**
 * Render robots.txt.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.robots = function(req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.render('robots', {
  });
};

