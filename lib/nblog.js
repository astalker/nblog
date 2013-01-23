var db = require('./mongoose')
  , util    = require('util')
  , moment = require('moment')
  , Crypto = require('crypto')
  , querystring = require('querystring')
  , http = require('http')
  , express = require('express')
  , path = require('path')
  ;

var app = express();
app.use(express.errorHandler());

var username, password, params;

exports.init = function(p){

  params = p;
  app.configure('development', function(){
      db.connect(params.dev.db, function(error) {
          if (error) throw error;
      });
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

      username = params.dev.user;
      password = params.dev.pass;
      public_path = params.config.public; 
  });

  app.configure('production', function(){
      db.connect(params.prod.db, function(error) {
          if (error) throw error;
      });
      app.use(express.errorHandler());

      username = params.prod.user;
      password = params.prod.pass;
      public_path = params.config.public;
  });

  app.configure(function(){
    app.set('port', process.env.PORT || params.dev.port);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, public_path)));
  });

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

  username = Crypto.createHmac('SHA256', username).update('string').digest('base64')
  password = Crypto.createHmac('SHA256', password).update('string').digest('base64')

  require('./routes')(app, this);

  app.on('close', function(errno) {
      this.close();
  });

}

exports.close = function(){
    db.disconnect(function(err) { });
};

exports.checkAccess = function(req, res, next) {
  if (req.cookies && req.cookies.user && req.cookies.user === username
      && req.cookies.pass && req.cookies.pass === password
      ) {
      next();
  } else {
    res.redirect('/login');
  }
}

exports.index = function(req, res){
  db.allArticles(params.config.per_page, function(err, articles) {
      if (err) {
          util.log('ERROR ' + err);
          throw err;
      } else
          res.render('index', {
              title: "Home",
              description: "Home",
              keywords: "Home",
              articles: articles,
              moment: moment
          });
  });
};

exports.page = function(req, res){
  db.allArticlesPaged(params.config.per_page, req.params.p, function(err, articles) {
      if (err) {
          util.log('ERROR ' + err);
          throw err;
      } else
          res.render('index', {
              title: "Home",
              description: "Home",
              keywords: "Home",
              articles: articles,
              moment: moment
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
              keywords: "Articles"
          });
  });
};
exports.login = function(req, res){
  res.render('login', { title: 'Login',
              description: "Login",
              keywords: "" });
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
        keywords: ""
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
            res.redirect('/admin');
        });
};

exports.admin = function(req, res){
    db.allArticles(100000, function(err, articles) {
        if (err) {
            util.log('ERROR ' + err);
            throw err;
        } else
            res.render('admin', {
                title: "admin",
                articles: articles,
                moment: moment,
                description: "",
                keywords: ""
            });
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
            keywords: ""
        });
    });
};
exports.article = function(req, res){
    db.findArticleByDate(
            req.params.year, 
            req.params.month, 
            req.params.day, 
            req.params.title, 
          function(error, article) {
            if (error) throw error;
            res.render('article', {
                title: article.title,
                description: article.description,
                keywords: article.keywords,
                postpath: '/edit',
                article: article,
                moment: moment
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
            res.redirect('/admin');
        });
};

exports.del = function(req, res){
    db.delete(req.query["id"], 
        function(error) {
            if (error) throw error;
            res.redirect('/admin');
        });
};