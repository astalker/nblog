var db = require('./mongoose')
  , path = require('path')
  , http = require('http')
  , Crypto = require('crypto')
  , express = require('express');

exports.init = function(params, callback){

  var app = express();
  app.use(express.errorHandler());

  app.configure('development', function(){
      db.connect(params.dev.db, function(error) {
          if (error) throw error;
      });
      app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

      username = params.dev.user;
      password = params.dev.pass; 
  });

  app.configure('production', function(){
      db.connect(params.prod.db, function(error) {
          if (error) throw error;
      });
      app.use(express.errorHandler());

      username = params.prod.user;
      password = params.prod.pass;
  });

  app.configure(function(){
    app.set('port', process.env.PORT || params.dev.port);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, params.config.public)));
  });

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

  username = Crypto.createHmac('SHA256', username).update('string').digest('base64')
  password = Crypto.createHmac('SHA256', password).update('string').digest('base64')

  app.on('close', function(errno) {
      this.close();
  });
  callback(app, username, password);

}