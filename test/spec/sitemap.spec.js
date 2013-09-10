var db = require('../../lib/db'),
  sitemap = require('../../lib/sitemap');

db.connect('mongodb://localhost/test', function () {});

describe('sitemap', function() {
  describe('url', function() {
    it('should return a url', function(done) {
      var response = '<url><loc>www.example.com</loc><lastmod>2013-01-01</lastmod><changefreq>1</changefreq><priority>0.6</priority></url>';
      var url = sitemap.url('www.example.com', '2013-01-01', '1', '0.6');
      expect(url).toEqual(response);
      done();
    });
  });

  describe('create', function() {
    it('should create a sitemap', function(done) {
      sitemap.create('www.example.com', function(sitemap) {
        expect(sitemap.length).not.toBe(0);
        done();
      });
    });
  });
});
