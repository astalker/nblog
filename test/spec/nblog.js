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

});
