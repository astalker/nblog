var db = require('../../lib/db'),
  helper = require('../../lib/helper');

db.connect('mongodb://localhost/test', function () {});

describe('Helper:', function() {
  describe('#prefs()', function() {
    it('should return a valid prefs object', function(done) {
      helper.prefs(function(pref) {
        expect(pref.settings).toBeDefined();
        expect(pref.pages).toBeDefined();
        done();
      }, 'getlog');
    });
  });

  describe('#gravatar()', function() {
    it('should return a length of 68', function(done) {
      helper.gravatar('test@example.com', function(g) {
        expect(g.length).toBe(68);
        done();
      });
    });
  });

  describe('#md5()', function() {
    it('should return a length of 32', function(done) {
      helper.md5('test', function(m) {
        expect(m.length).toBe(32);
        done();
      });
    });
  });

  describe('#log()', function() {
    it('should return a login message', function(done) {
      helper.log({}, {}, function(doc) {
        expect(doc.msg).toBeDefined();
        done();
      });
    });
  });

  describe('#data()', function() {
    var prefs, server;
    beforeEach(function() {
      prefs = {
        settings: {
          name: 'name',
          description: 'desc',
          keywords: 'keywords'
        }
      };
      server = {
        checkLoggedIn: function() {
          return false;
        }
      };
    });

    it('should build a data object using prefs as defaults', function(done) {
      var c = {
        field: 'field'
      };
      helper.init(server);
      var data = helper.data(null, null, prefs, c);
      expect(data.title).toEqual('name');
      expect(data.description).toEqual('desc');
      expect(data.keywords).toEqual('keywords');
      expect(data.loggedin).toBe(false);
      expect(data.field).toEqual('field');
      done();
    });

    it('should build a data object overiding title', function(done) {
      var c = {
        title: 'title'
      };
      var data = helper.data(null, null, prefs, c);
      expect(data.title).toEqual('title');
      done();
    });
  });
});
