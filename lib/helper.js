var db = require('./mongoose')
  , Crypto = require('crypto')
  , logmongo = require('logmongo');

exports.md5 = function(str, callback){
    var hash = Crypto.createHash('md5');
    hash.update(str, 'utf-8');
    callback(hash.digest('hex'));
}

exports.gravatar = function(email, callback){
  exports.md5(email, function(hash){
  	callback('http://www.gravatar.com/avatar/' + hash + '?s=40');
  });
};

exports.prefs = function(params, callback, getlog){
  db.projectPreferences(params, function(err, prefs, pages){
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