
var should = require('should'),
    db = require('../../lib/db'),
    helper = require('../../lib/helper');

db.connect('mongodb://localhost/test');

describe('helper', function() {
  describe('#prefs()', function() {
    it('should return a valid prefs object', function(done) {
      helper.prefs(function(pref) {
        pref.should.be.a('object');
        pref.should.have.property('settings');
        pref.should.have.property('pages');
        done();
      }, 'getlog');
    });
  });
  describe('#gravatar()', function() {
    it('should return a length of 68', function(done) {
      helper.gravatar('test@example.com', function(g) {
        g.should.have.length(68);
        done();
      });
    });
  });
  describe('#md5()', function() {
    it('should return a length of 32', function(done) {
      helper.md5('test', function(m) {
        m.should.have.length(32);
        done();
      });
    });
  });
  describe('#log()', function() {
    it('should return a login message', function(done) {
      helper.log({}, {}, function(doc) {
        doc.should.have.property('msg').and.not.be.empty;
        done();
      });
    });
  });
});

