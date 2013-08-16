var should = require('should'),
    nblog = require('../../lib/nblog');

describe('nblog', function() {
  describe('#init()', function() {
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


  describe('#data()', function() {
    var prefs;
    beforeEach(function() {
      prefs = {
        settings: {
          name: 'name',
          description: 'desc',
          keywords: 'keywords',
        }
      };
    });

    it('should build a data object using prefs as defaults', function(done) {
      var c = {
        field: 'field'
      };
      var data = nblog.data(prefs, false, c);
      data.should.be.a('object');
      data.should.have.property('title', 'name');
      data.should.have.property('description', 'desc');
      data.should.have.property('keywords', 'keywords');
      data.should.have.property('loggedin', false);
      data.should.have.property('field', 'field');
      done();
    });

    it('should build a data object overiding title', function(done) {
      var c = {
        title: 'title'
      };
      var data = nblog.data(prefs, false, c);
      data.should.be.a('object');
      data.should.have.property('title', 'title');
      done();
    });
  });

});
