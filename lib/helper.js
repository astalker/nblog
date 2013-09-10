var db = require('./db'),
  Crypto = require('crypto'),
  logmongo = require('logmongo'),
  moment = require('moment'),
  _ = require('underscore');

var server;

/**
 * Reference to the server.
 *
 * @param {Object} The server
 * @api public
 */
exports.init = function(s) {
  server = s;
};

/**
 * Create an md5 hash.
 *
 * @param {String} String to create the hash from
 * @param {Function} callback function
 * @api public
 */
exports.md5 = md5 = function(str, callback) {
  var hash = Crypto.createHash('md5');
  hash.update(str, 'utf-8');
  callback(hash.digest('hex'));
};

/**
 * Create a Gravatar url.
 *
 * @param {String} the email address to use as the basis for
 * the Gravatar
 * @param {Function} callback function
 * @api public
 */
exports.gravatar = gravatar = function(email, callback) {
  md5(email, function(hash) {
    callback('http://www.gravatar.com/avatar/' + hash + '?s=40');
  });
};

/**
 * Get application preferences specified in the object params
 * and from the database. The last login date is also returned if
 * requested.
 *
 * @param {String} String to create the hash from
 * @param {Function} callback function
 * @param {Boolean} get the last login date
 * @api public
 */
exports.prefs = prefs = function(callback, getlog) {
  db.projectPreferences(function(err, prefs, pages) {
    prefs.copyrightyear = moment(new Date()).format("YYYY");
    if (prefs.gravatar) {
      gravatar(prefs.email, function(g) {
        prefs.gravatar_url = g;
      });
    } else {
      prefs.gravatar_url = '';
    }
    if (getlog !== undefined) {
      log(prefs, pages, callback);
    } else {
      callback({ settings: prefs, pages: pages });
    }
  });
};

exports.log = log = function(prefs, pages, callback) {
  logmongo.lastLog(1, function (err, l) {
    var doc = {
      settings: prefs,
      pages: pages,
      msg: 'You last logged in ' + l.ts
      };
    logmongo.log('login', 1);
    callback(doc);
  });
};

/**
 * Render content
 *
 * @param {Object} request object
 * @param {Object} response object
 * @param {Object} preferences object
 * @param {Object} additional content object
 * @api public
 */
exports.data = data = function(req, res, prefs, content) {
  content.moment = moment;
  content.prefs = prefs;
  content.loggedin = server.checkLoggedIn(req, res);
  content = _.defaults(content, {
    title: prefs.settings.name,
    description: prefs.settings.description,
    keywords: prefs.settings.keywords
  });
  return content;
};

/**
 * Get the data to display
 *
 * @param {Object} request object
 * @param {Object} response object
 * @param {Object} content object
 * @param {Object} callback the callback function
 * @api public
 */
exports.displayData = function(req, res, content, route) {
  prefs(function(prefs) {
    content.moment = moment;
    content.prefs = prefs;
    content.loggedin = server.checkLoggedIn(req, res);
    content = _.defaults(content, {
      title: prefs.settings.name,
      description: prefs.settings.description,
      keywords: prefs.settings.keywords
    });
    res.render(route, content);
  });
};

