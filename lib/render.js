var db = require('./db'),
  helper = require('./helper'),
  moment = require('moment'),
  querystring = require('querystring');

exports.index = function (error, articles, req, res, next) {
  if (error) throw error;
  var c = { articles: articles, prev: 0, next: next};
  helper.displayData(req, res, c, 'index');
};

/**
 * Render the article add page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.add = function (req, res) {
  var c = {
    title: 'Add',
    postpath: '/add',
    ts: '',
    item: db.emptyArticle  // blank item so the template works
  };
  helper.displayData(req, res, c, 'edit');
};

/**
 * Render the article.
 *
 * @param {Object} article
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
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

/**
 * Render the articles list.
 *
 * @param {Object} error
 * @param {Object} articles
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
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

/**
 * Render the articles when paginated list.
 *
 * @param {Object} error
 * @param {Object} articles
 * @param {Number} next the next page
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.articlesPaged = function (error, articles, next, req, res) {
  if (error) throw error;
  var c = {
    articles: articles,
    prev: Number(req.params.p) -1,
    next: next
  };
  helper.displayData(req, res, c, 'index');
};

/**
 * Render the edit article form.
 *
 * @param {Object} error
 * @param {Object} article
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
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

/**
 * Render the edit page form.
 *
 * @param {Object} error
 * @param {Object} page
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
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

/**
 * Render the page.
 *
 * @param {Object} content the page
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.page = function (content, req, res) {
  var c = {
    content: content,
    description: content.description,
    keywords: content.keywords
  };
  helper.displayData(req, res, c, 'content');
};

/**
 * Render the page add form.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.addpage = function (req, res) {
  var c = {
    title: 'Add',
    postpath: '/add-page',
    ts: '',
    item: db.emptyPage
  };
  helper.displayData(req, res, c, 'edit-page');
};

/**
 * Render the preferences edit page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.preferences = function (req, res) {
  var c = {
    title: 'Preferences'
  };
  helper.displayData(req, res, c, 'preferences');
};

/**
 * Render the login page.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.login = function (req, res) {
  var c = {
    title: 'Login',
    description: 'Login'
  };
  helper.displayData(req, res, c, 'login');
};

/**
 * Render the error page.
 *
 * @param {Object} error object
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.error = function (error, req, res) {
  var c = {
    title: 'Error',
    error: error
  };
  helper.displayData(req, res, c, 'error');
};
