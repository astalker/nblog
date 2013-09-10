var db = require('./db'),
  path = require('path'),
  http = require('http'),
  Crypto = require('crypto'),
  express = require('express');

var username, password;
/**
 * Setup the server and framework with the provided params.
 *
 * @param {Object} the params
 * @param {Function} the callback function
 * @api public
 */
exports.init = function(params, callback) {

  var app = express();
  var error = null;
  app.use(express.errorHandler());

  app.configure('development', function() {
    db.connect(params.dev.db, function(err) {
      callback(app, err);
    });
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    username = params.dev.user;
    password = params.dev.pass;
  });

  app.configure('production', function() {
    db.connect(params.prod.db, function(err) {
      callback(app, err);
    });
    app.use(express.errorHandler());

    username = params.prod.user;
    password = params.prod.pass;
  });

  app.configure(function() {
    app.set('port', process.env.PORT || params.dev.port);
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, params.path)));
  });

  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });

  username = Crypto.createHmac('SHA256', username).update('string').digest('base64');
  password = Crypto.createHmac('SHA256', password).update('string').digest('base64');

  app.on('close', function(errno) {
    this.close();
  });
  callback(app);

};

/**
 * Check if logged in.
 *
 * @param {Object} request object
 * @param {Object} response object
 * @api public
 */
exports.checkLoggedIn = function(req, res) {
  return (req.cookies && req.cookies.user && req.cookies.user === username &&
    req.cookies.pass && req.cookies.pass === password
  );
};
