var db = require('./mongoose')
  , Crypto = require('crypto')
  , logmongo = require('logmongo');

/**
 * Create an md5 hash.
 *
 * @param {String} String to create the hash from
 * @param {Function} callback function
 * @api public
 */
exports.md5 = function(str, callback){
    var hash = Crypto.createHash('md5');
    hash.update(str, 'utf-8');
    callback(hash.digest('hex'));
}

/**
 * Create a Gravatar url.
 *
 * @param {String} the email address to use as the basis for the Gravatar
 * @param {Function} callback function
 * @api public
 */
exports.gravatar = function(email, callback){
  exports.md5(email, function(hash){
  	callback('http://www.gravatar.com/avatar/' + hash + '?s=40');
  });
};

/**
 * Get application preferences specified in the object params and from the database. The last login date is also returned if requested.
 *
 * @param {String} String to create the hash from
 * @param {Function} callback function
 * @param {Boolean} get the last login date
 * @api public
 */
exports.prefs = function(params, callback, getlog){
  db.projectPreferences(params, function(err, prefs, pages){
    var doc;
    if (prefs.gravatar){
      exports.gravatar(prefs.email, function(g){
        prefs.gravatar_url = g;
      });
    } else {
    	prefs.gravatar_url = '';
    }
    if (getlog!==undefined){
      logmongo.lastLog(1, function (err, l){
        doc = { settings: prefs, pages: pages, msg: 'You last logged in '+l.ts };
        logmongo.log('login', 1);
        callback(doc);
      });
    } else {
      doc = { settings: prefs, pages: pages };
      callback(doc);
    }
  });
}