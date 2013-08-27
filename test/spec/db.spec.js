var db = require('../../lib/db');

db.connect('mongodb://localhost/test');

describe('Articles', function() {

  var currentArticle = null;

  //add some test data
  beforeEach(function(done) {
    db.add('article1', '', 'article1', 'description', 'keywords', 'alias', function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.add('article2', '', 'article2', 'description', 'keywords', 'alias', function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.add('article3', '', 'article3', 'description', 'keywords', 'alias', function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.addpage('page1', '', 'page1', 'content', 'description', 'keywords', 'alias', 0, function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.addpage('page2', '', 'page2', 'content', 'description', 'keywords', 'alias', 1, function(doc) {
      done();
    });
  });

  afterEach(function(done) {
    db.remove(function() {
      done();
    });
  });

  describe('#countArticles()', function() {
    it('should return a count of 3', function(done) {
      db.countArticles(function(err, count) {
        expect(count).toEqual(3);
        done();
      });
    });
  });

  describe('#allArticles()', function() {
    it('should return articles 3 and 2', function(done) {
      db.allArticles(2, function(err, articles) {
        expect(articles.length).toEqual(2);
        expect(articles[0].title).toEqual('article3');
        done();
      });
    });
  });

  describe('#allArticlesPaged()', function() {
    it('should return 1 article from the second page', function(done) {
      db.allArticlesPaged(2, 2, function(err, articles) {
        expect(articles.length).toEqual(1);
        expect(articles[0].title).toEqual('article1');
        done();
      });
    });
  });

  describe('#allArticlesPages()', function() {
    it('should return 1 article and 2 pages', function(done) {
      db.allArticlesPages(1, function(err, articles, pages) {
        expect(articles.length).toEqual(1);
        expect(articles[0].title).toEqual('article3');
        expect(pages.length).toEqual(2);
        expect(pages[0].page).toEqual('page2');
        done();
      });
    });
  });

  describe('#allMenuPages()', function() {
    it('should return 1 page', function(done) {
      db.allMenuPages(function(err, pages) {
        expect(pages.length).toEqual(1);
        expect(pages[0].page).toEqual('page2');
        done();
      });
    });
  });

});
