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

  describe('#articles()', function() {
    it('should get 1 Article', function(done) {
      db.articles(1, function(err, articles) {
        expect(articles.length).toEqual(1);
        expect(articles[0].title).toEqual('article3');
        done();
      });
    });
    it('should return most recent articles 3 and 2', function(done) {
      db.articles(2, function(err, articles) {
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

    it('Should find an Article by Date and title', function(done) {
      var start, end;
      start = end = new Date('2013', '06'-1, '02');   //months are 0 based so Jan equals 0
      db.findArticleByDate(start, end, 'article-1', function(err, doc) {
        expect(doc.alias).toEqual('article-1');
        expect(doc.title).toEqual('article1');
        done();
      });
    });

    it('Should return null when an article is not found', function(done) {
      var start, end;
      start = end = new Date('2013', '06'-1, '02');   //months are 0 based so Jan equals 0
      db.findArticleByDate(start, end, 'no-article', function(err, doc) {
        expect(doc).toBeNull();
        done();
      });
    });
  });

});
