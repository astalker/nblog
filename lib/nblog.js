var db = require('./mongoose')
  , util    = require('util')
  , moment = require('moment')
  , Crypto = require('crypto')
  , querystring = require('querystring')
  , helper = require('./helper')
  , sitemap = require('./sitemap')
  ;

var username, password, params, next;

/**
 * Starts the App.
 *
 * @param {Object} the params
 * @api public
 */
exports.init = function(p){

  params = p;
  var app, server = require('./server');

  server.init(p, function(express, u, p){
    app = express;
    username = u;
    password = p;    
  });

  params.config.copyrightyear = moment(new Date()).format("YYYY");
  require('./routes')(app, this);
}

/**
 * Close DB connection.
 *
 * @api public
 */
exports.close = function(){
  db.disconnect(function(err) { });
};

/**
 * Check if logged in.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
checkLoggedIn = exports.checkLoggedIn = function(req, res) {
  return (req.cookies && req.cookies.user && req.cookies.user === username
      && req.cookies.pass && req.cookies.pass === password
      );
}

/**
 * Starts the App.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @param {Function} function to call on success
 * @api public
 */
exports.checkAccess = function(req, res, next) {
  if (exports.checkLoggedIn(req, res)) {
      next();
  } else {
    res.redirect('/login');
  }
}

/**
 * Render the Index page, get the preferences and articles for the homepage.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.index = function(req, res){
  exports.nextArticles(req, res, 1, function(n){
      next=n;
  });
  helper.prefs(params, function(prefs){
    db.allArticles(prefs.items, function(err, articles) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else
        res.render('index', {
          title: prefs.settings.name,
          description: prefs.description,
          keywords: prefs.keywords,
          articles: articles,
          moment: moment,
          prev: 0,
          next: next,
          params: params,
          prefs: prefs,
          loggedin: exports.checkLoggedIn(req, res)
      });
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
exports.page = function(req, res){
  exports.nextArticles(req, res, req.params.p, function(n){
      next=n;
  });
  helper.prefs(params, function(prefs){    
    db.allArticlesPaged(prefs.items, req.params.p, function(err, articles) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else {
        res.render('index', {
          title: prefs.settings.name,
          description: prefs.description,
          keywords: prefs.keywords,
          articles: articles,
          moment: moment,
          prev: parseInt(req.params.p) -1,
          next: next,
          params: params,
          prefs: prefs,
          loggedin: exports.checkLoggedIn(req, res)
        });
      }
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
exports.content = function(req, res){
  helper.prefs(params, function(prefs){
    db.findPageByAlias(
      req.params.c, 
      function(error, content) {
        if (error) throw error;
        res.render('content', {
          title: prefs.settings.name,
          description: content.description,
          keywords: content.keywords,
          postpath: '/edit',
          content: content,
          moment: moment,
          params: params,
          prefs: prefs,
          loggedin: exports.checkLoggedIn(req, res)
        });
    });
  });
};

/**
 * Render the articles page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.articles = function(req, res){
  helper.prefs(params, function(prefs){
    db.allArticles(100000, function(err, articles) {
    if (err) {
        util.log('ERROR ' + err);
        throw err;
    } else
      res.render('articles', {
        title: "Articles",
        articles: articles,
        moment: moment,
        count: 1,
        querystring: querystring,
        description: "Articles",
        keywords: "Articles",
        params: params,
        prefs: prefs,
        loggedin: exports.checkLoggedIn(req, res) 
      });
    });
  });
};

/**
 * Render the login page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.login = function(req, res){
  helper.prefs(params, function(prefs){
    res.render('login', { title: 'Login',
      description: "Login",
      keywords: "",
      params: params,
      prefs: prefs,
      loggedin: false 
    });
  });
};

/**
 * On login form post.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.loginpost = function(req, res){
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
exports.logout = function(req, res){
  res.cookie('user', '');
  res.cookie('pass', '');
  res.redirect('/');
};

/**
 * Render the article add page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.add = function(req, res){
  helper.prefs(params, function(prefs){
    res.render('edit', { title: 'Add',
      postpath: '/add',
      moment: moment,
      ts: '',
      item: db.emptyArticle,  // blank item so the template works
      description: "",
      keywords: "",
      params: params,
      prefs: prefs,
      loggedin: true 
    });
  });
};

/**
 * On article Add form post.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpost = function(req, res){
  if (req.body.title=='' || req.body.description=='' || req.body.ts=='')
    throw error;

  if (req.body.alias=='')
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
 * Render the add page form.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpage = function(req, res){
  helper.prefs(params, function(prefs){
    res.render('edit-page', { title: 'Add',
      postpath: '/add-page',
      ts: '',
      item: db.emptyPage,  // blank item so the template works
      description: "",
      keywords: "",
      params: params,
      prefs: prefs,
      loggedin: true 
    });
  });
};

/**
 * On page form submission.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpagepost = function(req, res){
  if (req.body.page=='')
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
exports.admin = function(req, res){
  var getlastlog = req.query["login"];

  helper.prefs(params, function(prefs){
    db.allArticlesPages(100000, function(err, articles, pages) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else
      {
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

        res.render('admin', {
          title: "Admin",
          articles: articles,
          pages: pages,
          moment: moment,
          description: "",
          keywords: "",
          params: params,
          prefs: prefs,
          loggedin: true,
          flash: msg,
          delete_notice: del_id,
          delete_page_notice: del_page_id
        });
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
exports.edit = function(req, res){
  helper.prefs(params, function(prefs){
    db.findArticleById(req.query["id"], function(error, article) {
      if (error) throw error;
      res.render('edit', {
        title: "Edit",
        postpath: '/edit',
        item: article,
        ts: moment(new Date(article.ts)).format("MM/DD/YYYY"),
        moment: moment,
        description: "",
        keywords: "",
        params: params,
        prefs: prefs,
        loggedin: true 
      });
    });
  });
};

/**
 * Render a single article page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.article = function(req, res){
  helper.prefs(params, function(prefs){
    db.findArticleByDate(
      req.params.year, 
      req.params.month, 
      req.params.day, 
      req.params.title, 
      function(error, article) {
        if (error) throw error;
        res.render('article', {
          title: prefs.settings.name,
          description: article.description,
          keywords: article.keywords,
          postpath: '/edit',
          article: article,
          moment: moment,
          params: params,
          prefs: prefs,
          loggedin: exports.checkLoggedIn(req, res)
        });
    });
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
exports.del = function(req, res){
  res.redirect('/admin?confirm='+req.query["id"]);
};

/**
 * On article delete form submission confirmation.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.delconfirm = function(req, res){
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
exports.delpage = function(req, res){
  res.redirect('/admin?confirm-page='+req.query["id"]);
};

/**
 * On page delete form submission confirmation.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.delpageconfirm = function(req, res){
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
  db.countArticles(function (err, num){
    if (parseInt(num) > (parseInt(page) * params.config.per_page)) {
        callback(parseInt(page) + 1);
    } else {
        callback(0);
    }
  });
}

/**
 * Render the preferences edit page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.preferences = function(req, res){
  helper.prefs(params, function(prefs){
    res.render('preferences', {
      title: 'Preferences',
      description: '',
      keywords: '',
      prefs: prefs,
      loggedin: true
    });    
  })
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
exports.editpage = function(req, res){
  helper.prefs(params, function(prefs){
    db.findPageById(req.query["id"], function(error, page) {
      if (error) throw error;
      res.render('edit-page', {
        title: "Edit",
        postpath: '/edit-page',
        item: page,
        ts: moment(new Date(page.ts)).format("MM/DD/YYYY"),
        moment: moment,
        description: "",
        keywords: "",
        params: params,
        prefs: prefs,
        loggedin: true 
      });
    });
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
    });
};

/**
 * Render the Google sitemap xml.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.sitemap = function(req, res) {
  host = baseurl = 'http://'+req.headers.host;
  sitemap.create(host, function (sitemap) {
    res.setHeader("Content-Type", "text/xml");
    res.render('sitemap', { 
      sitemap: sitemap
    });
  });
}
