var db = require('./db'),
    helper = require('./helper'),
    moment = require('moment');

exports.article = function (error, article, req, res) {
  if (error) throw error;
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

exports.addpage = function (req, res) {
  var c = {
    title: 'Add',
    postpath: '/add-page',
    ts: '',
    item: db.emptyPage
  };
  helper.displayData(req, res, c, 'edit-page');
};
