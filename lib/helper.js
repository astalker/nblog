var db = require('./mongoose')
  , Crypto = require('crypto');

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

exports.prefs = function(params, callback){
  db.projectPreferences(params, function(err, prefs){
    if (prefs.gravatar){
      exports.gravatar(prefs.email, function(g){
        prefs.gravatar_url = g;
      });
    } else {
    	prefs.gravatar_url = '';
    }
    callback(prefs);
  });
}