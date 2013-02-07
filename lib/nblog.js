var db = require('./mongoose')
  , util    = require('util')
  , moment = require('moment')
  , Crypto = require('crypto')
  , querystring = require('querystring')
  ;

var username, password, params, next;

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

exports.close = function(){
  db.disconnect(function(err) { });
};

checkLoggedIn = exports.checkLoggedIn = function(req, res) {
  return (req.cookies && req.cookies.user && req.cookies.user === username
      && req.cookies.pass && req.cookies.pass === password
      );
}

exports.checkAccess = function(req, res, next) {
  if (exports.checkLoggedIn(req, res)) {
      next();
  } else {
    res.redirect('/login');
  }
}

exports.index = function(req, res){
  exports.nextArticles(req, res, 1, function(n){
      next=n;
  });
  db.projectPreferences(params, function(err, prefs){
    db.allArticles(prefs.items, function(err, articles) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else
        res.render('index', {
          title: prefs.name,
          description: prefs.description,
          keywords: prefs.keywords,
          articles: articles,
          moment: moment,
          prev: 0,
          next: next,
          params: params,
          loggedin: exports.checkLoggedIn(req, res)
      });
    });
  });
};

exports.page = function(req, res){
  exports.nextArticles(req, res, req.params.p, function(n){
      next=n;
  });
  db.projectPreferences(params, function(err, prefs){    
    db.allArticlesPaged(prefs.items, req.params.p, function(err, articles) {
      if (err) {
        util.log('ERROR ' + err);
        throw err;
      } else {
        res.render('index', {
          title: prefs.name,
          description: prefs.description,
          keywords: prefs.keywords,
          articles: articles,
          moment: moment,
          prev: parseInt(req.params.p) -1,
          next: next,
          params: params,
          loggedin: exports.checkLoggedIn(req, res)
        });
      }
    });
  });
};

exports.articles = function(req, res){
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
      loggedin: exports.checkLoggedIn(req, res) 
    });
  });
};
exports.login = function(req, res){
  res.render('login', { title: 'Login',
    description: "Login",
    keywords: "",
    params: params,
    loggedin: false 
  });
};
exports.loginpost = function(req, res){
  res.cookie('user', Crypto.createHmac('SHA256', req.body.username).update('string').digest('base64'));
  res.cookie('pass', Crypto.createHmac('SHA256', req.body.password).update('string').digest('base64'));
  res.redirect('/admin');
};
exports.logout = function(req, res){
  res.cookie('user', '');
  res.cookie('pass', '');
  res.redirect('/');
};
exports.add = function(req, res){
  res.render('edit', { title: 'Add',
    postpath: '/add',
    moment: moment,
    ts: '',
    item: db.emptyArticle,  // blank item so the template works
    description: "",
    keywords: "",
    params: params,
    loggedin: true 
  });
};
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

exports.admin = function(req, res){
  db.allArticles(100000, function(err, articles) {
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

      res.render('admin', {
        title: "Admin",
        articles: articles,
        moment: moment,
        description: "",
        keywords: "",
        params: params,
        loggedin: true,
        flash: msg
      });
    }
  });
};

exports.edit = function(req, res){
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
      loggedin: true 
    });
  });
};
exports.article = function(req, res){
  db.projectPreferences(params, function(err, prefs){
    db.findArticleByDate(
      req.params.year, 
      req.params.month, 
      req.params.day, 
      req.params.title, 
      function(error, article) {
        if (error) throw error;
        res.render('article', {
          title: prefs.name,
          description: article.description,
          keywords: article.keywords,
          postpath: '/edit',
          article: article,
          moment: moment,
          params: params,
          loggedin: exports.checkLoggedIn(req, res)
        });
    });
  });
};
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

exports.del = function(req, res){
  db.delete(req.query["id"], 
    function(error) {
      if (error) throw error;
      res.redirect('/admin?del=1');
    });
};

nextArticles = exports.nextArticles = function(req, res, page, callback) {
  db.countArticles(function (err, num){
    if (parseInt(num) > (parseInt(page) * params.config.per_page)) {
        callback(parseInt(page) + 1);
    } else {
        callback(0);
    }
  });
}

exports.preferences = function(req, res){
  db.projectPreferences(params, function(err, prefs){
    res.render('preferences', {
      title: 'Preferences',
      project: prefs,
      description: '',
      keywords: '',
      loggedin: true
    });    
  })
};

exports.save = function(req, res) {
  db.save( 
    req.body.name,
    req.body.items, 
    req.body.description, 
    req.body.keywords,
    function(error) {
        if (error) throw error;
        res.redirect('/admin?pref=1');
    });
};