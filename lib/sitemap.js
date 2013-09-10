var db = require('./db'),
  moment = require('moment');

/**
 * Generate a url.
 *
 * @param {String} url
 * @param {String} date
 * @param {String} freq
 * @param {String} priority
 * @api public
 */
exports.url = function(url, date, freq, priority) {
  var item;
  item = '<url>';
  item += '<loc>' + url + '</loc>';
  item += '<lastmod>' + date + '</lastmod>';
  item += '<changefreq>' + freq + '</changefreq>';
  item += '<priority>' + priority + '</priority>';
  item += '</url>';
  return item;
};

/**
 * Create the sitemap and return it to the callback function.
 *
 * @param {String} host
 * @param {Function} callback the callback function
 * @api public
 */
exports.create = function(host, callback) {
  var page, article, url, d, i, p;
  var sitemap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

  db.allArticlesPages(100000, function(err, articles, pages) {
    if (err) {
      util.log('ERROR ' + err);
      throw err;
    } else {
      for (i = 0; i < articles.length; i++) {
        article = articles[i];
        if (article.alias !== undefined) {
          url = host + '/';
          d = moment.utc(new Date(article.ts)).format();

          if (i === 0) {
            sitemap += exports.url(host, d, 'weekly', '0.9');
            sitemap += exports.url(url + 'articles', d, 'weekly', '0.9');
          }
          url += moment(new Date(article.ts)).format("YYYY") +
              '/' + moment(new Date(article.ts)).format("MM") +
              '/' + moment(new Date(article.ts)).format("DD") +
              '/';
          url += article.alias;
          sitemap += exports.url(url, d, 'yearly', '0.8');
        }
      }
      for (p = 0; i < pages.length; i++) {
        page = pages[i];
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
