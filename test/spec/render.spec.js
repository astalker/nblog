var helper = require('../../lib/helper'),
  render = require('../../lib/render');

describe('Render:', function() {

  describe('Rendering an Article', function() {
    beforeEach(function() {
      spyOn(helper, 'displayData');
      article = {
        title: 'title', description: 'desc', keywords: 'key', postpath: '/', article: '', ts: '123'
      };
      render.article(article, 'req', 'res');
    });

    it('should display an article', function(done) {
      var response = { title: 'title', description: 'desc', keywords: 'key', article: '', postpath: '/edit', ts: '1st Jan 0123'};
      expect(helper.displayData).toHaveBeenCalledWith('req', 'res', response, 'article');
      done();
    });
  });

  describe('Editing an Article', function() {
    beforeEach(function() {
      spyOn(helper, 'displayData');
      article = {
        ts: '123'
      };
      render.edit(null, article, 'req', 'res');
    });

    it('should display an article', function(done) {
      var response = { title : 'Edit', postpath : '/edit', item : { ts : '123' }, ts : '01/01/0123' };
      expect(helper.displayData).toHaveBeenCalledWith('req', 'res', response, 'edit');
      done();
    });
  });
});
