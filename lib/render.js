var db = require('./db'),
    helper = require('./helper'),
    moment = require('moment'),
    querystring = require('querystring');

exports.index = function (error, articles, req, res, next) {
  if (error) throw error;
  var c = { articles: articles, prev: 0, next: next};
  helper.displayData(req, res, c, 'index');
};

exports.add = function (req, res) {
  var c = {
    title: 'Add',
    postpath: '/add',
    ts: '',
    item: db.emptyArticle  // blank item so the template works
  };
  helper.displayData(req, res, c, 'edit');
};

exports.article = function (article, req, res) {
  var c = {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    article: article.article,
    postpath: '/edit',
    ts: moment(new Date(article.ts)).format("Do MMM YYYY")
  };
  helper.displayData(req, res, c, 'article');
};

exports.articles = function (error, articles, req, res) {
  if (error) throw error;
  var c = {
    title: 'Articles',
    articles: articles,
    count: 1,
    querystring: querystring,
    description: "Articles",
    keywords: "Articles"
  };
  helper.displayData(req, res, c, 'articles');
};

exports.articlesPaged = function (error, articles, next, req, res) {
  if (error) throw error;
  var c = {
    articles: articles,
    prev: Number(req.params.p) -1,
    next: next
  };
  helper.displayData(req, res, c, 'index');
};

exports.edit = function (error, article, req, res) {
  if (error) throw error;
  var c = {
    title: "Edit",
    postpath: '/edit',
    item: article,
    ts: moment(new Date(article.ts)).format("MM/DD/YYYY")
  };
  helper.displayData(req, res, c, 'edit');
};

exports.editpage = function (error, page, req, res) {
  if (error) throw error;
  var c = {
    title: "Edit",
    postpath: '/edit-page',
    item: page,
    ts: moment(new Date(page.ts)).format("MM/DD/YYYY")
  };
  helper.displayData(req, res, c, 'edit-page');
};

exports.page = function (content, req, res) {
  var c = {
    content: content,
    description: content.description,
    keywords: content.keywords
  };
  helper.displayData(req, res, c, 'content');
};

exports.addpage = function (req, res) {
  var c = {
    title: 'Add',
    postpath: '/add-page',
    ts: '',
    item: db.emptyPage
  };
  helper.displayData(req, res, c, 'edit-page');
};

exports.preferences = function (req, res) {
  var c = {
    title: 'Preferences'
  };
  helper.displayData(req, res, c, 'preferences');
};

exports.login = function (req, res) {
  var c = {
    title: 'Login',
    description: 'Login'
  };
  helper.displayData(req, res, c, 'login');
};

exports.error = function (error, req, res) {
  var c = {
    title: 'Error',
    error: error
  };
  helper.displayData(req, res, c, 'error');
};
