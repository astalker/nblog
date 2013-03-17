
var should = require('should')
	, helper = require('../lib/helper')

describe('helper', function(){
  describe('#gravatar()', function(){
    it('should return a length of 68', function(done){
      helper.gravatar('test@example.com', function(g){
        g.should.have.length(68);
        done();
      });
    });
  });
});

