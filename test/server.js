
var should = require('should')
  , db = require('../lib/mongoose')
  , helper = require('../lib/helper')

var params = {
  config: {
    project: 'My Project',
    public: '/../public',
    per_page: '1'
  }
}

db.connect('mongodb://localhost/test');

describe('Articles', function(){

  var currentArticle = null;

  beforeEach(function(done){
    //add some test data    
    db.add('test', '', 'article', 'description', 'keywords', 'alias', function(doc){
      currentArticle = doc;
      done();
    });
  });

  afterEach(function(done){
    db.remove(function() {
      done();
    });
  });

});
