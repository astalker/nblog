
var should = require('should'),
    db = require('../../lib/mongoose'),
    sitemap = require('../../lib/sitemap');

var params = {
  config: {
    project: 'My Project',
    public: '/../../public',
    per_page: '1'
  }
};

db.connect('mongodb://localhost/test');

describe('sitemap', function() {
  describe('url', function() {
    it('should return a url', function(done) {
      response = '<url><loc>www.example.com</loc><lastmod>2013-01-01</lastmod><changefreq>1</changefreq><priority>0.6</priority></url>';
      url = sitemap.url('www.example.com', '2013-01-01', '1', '0.6');
      url.should.be.a('string');
      url.should.equal(response);
      done();
    });
  });

  describe('create', function() {
    it('should create a sitemape', function(done) {
      sitemap.create('www.example.com', function(sitemap) {
        sitemap.should.be.a('string').and.not.have.length(0);
        done();
      });
    });
  });
});

