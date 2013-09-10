var db = require('../../lib/db'),
  nblog = require('../../lib/nblog'),
  server = require('../../lib/server');

describe('Nblog:', function() {

  describe('when initialising the app', function() {
    var params = {
      dev: {
        user: 'user',
        pass: 'password',
        port: '3001',
        db:   'mongodb://localhost/test'
      }
    };
    params.prod = params.dev;

    it('should initialise the app without an error', function(done) {
      nblog.init(params);
      done();
    });
  });

  describe('when logged in should proceed to next function', function() {
    beforeEach(function() {
      spyOn(server, 'checkLoggedIn').andReturn(true);
      next = jasmine.createSpy('next');
      var data = nblog.checkAccess(null, null, next);
    });

    it('should build a data object using prefs as defaults', function(done) {
      expect(next).toHaveBeenCalled();
      done();
    });
  });

  describe('when not logged in should redirect to login page', function() {
    beforeEach(function() {
      spyOn(server, 'checkLoggedIn').andReturn(false);
      res = {
        redirect: function(value) {}
      };
      spyOn(res, 'redirect');
      nblog.checkAccess(null, res, null);
    });

    it('should build a data object using prefs as defaults', function(done) {
      expect(res.redirect).toHaveBeenCalledWith('/login');
      done();
    });
  });

  describe('Getting a Single Article', function() {

    it('should call the model to get the article', function(done) {
      spyOn(db, 'findArticleByDate');
      req = {
        params: 'test'
      }
      nblog.article(req);
      expect(db.findArticleByDate).toHaveBeenCalled();
      done();
    });

  });

  describe('Editing an Article', function() {
    beforeEach(function() {
      spyOn(db, 'findArticleById');
      req = {
        query: { id: '1' }
      }
      nblog.edit(req);
    });

    it('should call the model to get the article', function(done) {
      expect(db.findArticleById).toHaveBeenCalled();
      done();
    });
  });
});
