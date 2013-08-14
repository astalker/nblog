var db = require('./db'),
    moment = require('moment');

/**
 * Generate a url.
 *
 * @param {String} url
 * @param {String} date
 * @param {String} frequency
 * @api public
 */
exports.url = function(url, date, freq, priority) {
  var sitemap;
  sitemap = '<url>';
  sitemap += '<loc>' + url + '</loc>';
  sitemap += '<lastmod>' + date + '</lastmod>';
  sitemap += '<changefreq>' + freq + '</changefreq>';
  sitemap += '<priority>' + priority + '</priority>';
  sitemap += '</url>';
  return sitemap;
};

/**
 * Create the sitemap and return it to the callback function.
 *
 * @param {String} host
 * @param {Function} the callback function
 * @api public
 */
exports.create = function(host, callback) {

  var sitemap = '<?xml version="1.0" encoding="UTF-8"?>';
  var page, article;
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

  db.allArticlesPages(100000, function(err, articles, pages) {
    if (err) {
        util.log('ERROR ' + err);
        throw err;
    } else {
      for (article in articles) {
        article = articles[article];
        if (article.alias !== undefined)
        {
          url = host + '/';
          d = moment.utc(new Date(article.ts)).format();

          if (i === 0) {
            sitemap += exports.url(host, d, 'weekly', '0.9');
            sitemap += exports.url(url + 'articles', d, 'weekly', '0.9');
          }
          url += moment(new Date(article.ts)).format("YYYY") + '/' + moment(new Date(article.ts)).format("MM") + '/' + moment(new Date(article.ts)).format("DD") + '/';
          url += article.alias;
          sitemap += exports.url(url, d, 'yearly', '0.8');
        }
      }
      for (page in pages) {
        page = pages[page];
        url = host + '/';
        d = moment.utc(new Date(page.ts)).format();
        url += 'content/' + page.alias;
        sitemap += exports.url(url, d, 'yearly', '0.8');
      }
    }

    sitemap += '</urlset>';
    callback(sitemap);
  });

};
