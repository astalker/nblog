var helper = require('./helper');

exports.article = function (error, article, req, res) {
  if (error) throw error;
  var c = {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    postpath: '/edit',
    article: article
  };
  helper.displayData(req, res, c, 'article');
};
