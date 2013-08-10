
var should = require('should'),
    db = require('../../lib/mongoose'),
    helper = require('../../lib/helper');

var params = {
  config: {
    project: 'My Project',
    public: '/../../public',
    per_page: '1'
  }
};

db.connect('mongodb://localhost/test');

describe('helper', function() {
  describe('#prefs()', function() {
    it('should return a valid prefs object', function(done) {
      helper.prefs(params, function(pref) {
        pref.should.be.a('object');
        pref.should.have.property('settings');
        pref.should.have.property('pages');
        pref.should.have.property('msg');
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
});

