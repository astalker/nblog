var db = require('../../lib/db');

db.connect('mongodb://localhost/test', function (error) {
  done();
});

describe('Articles', function() {

  var currentArticle = null;

  //add some test data
  beforeEach(function(done) {
    db.add('article1', '06/02/2013', 'article1', 'description', 'keywords', 'article-1', function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.add('article2', '06/03/2013', 'article2', 'description', 'keywords', 'article-2', function(doc) {
      done();
    });
  });
  beforeEach(function(done) {
    db.add('article3', '06/04/2013', 'article3', 'description', 'keywords', 'article-3', function(doc) {
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
    it('should get 1 Article', function(done) {
      db.allArticles(1, function(err, articles) {
        expect(articles.length).toEqual(1);
        expect(articles[0].title).toEqual('article3');
        done();
      });
    });
    it('should return most recent articles 3 and 2', function(done) {
      db.allArticles(2, function(err, articles) {
        expect(articles.length).toEqual(2);
        expect(articles[1].title).toEqual('article2');
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

  describe('#findArticleByDate()', function() {
    it('Should find an Article by Date an title', function(done) {
      db.findArticleByDate('2013', '06', '01', 'article-1', function(err, doc) {
        done();
      });
    });
  });

});
