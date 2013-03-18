
var should = require('should')
  , helper = require('../lib/helper')
  , nblog = require('../lib/nblog')

var params = {
  config: {
    project: 'My Project',
    public: '/../public',
    per_page: '1'
  },
  dev: {
    user: 'user',
    pass: 'password',
    port: '3000',
    db:   'mongodb://localhost/items'
    },
  prod: {
    user: 'user',
    pass: 'password',
    db:   'mongodb://localhost/articles'
    }
}

describe('helper', function(){
  describe('#prefs()', function(){
    it('should return a valid prefs object', function(done){
      nblog.init(params);
      helper.prefs(params, function(pref){
        pref.should.be.a('object');
        pref.should.have.property('settings');
        pref.should.have.property('pages');
        pref.should.have.property('msg');
        done();
      }, 'getlog');
    });
  });
  describe('#gravatar()', function(){
    it('should return a length of 68', function(done){
      helper.gravatar('test@example.com', function(g){
        g.should.have.length(68);
        done();
      });
    });
  });
  describe('#md5()', function(){
    it('should return a length of 32', function(done){
      helper.md5('test', function(m){
        m.should.have.length(32);
        done();
      });
    });
  });
});

