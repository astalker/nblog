var helper = require('../../lib/helper'),
    render = require('../../lib/render');

describe('Helper', function() {
  describe('Rendering an Article', function() {
    beforeEach(function() {
      spyOn(helper, 'displayData');
      article = {
        title: 'title', description: 'desc', keywords: 'key', postpath: '/', article: ''
      };
      render.article(null, article, 'req', 'res');
    });

    it('should display an article', function(done) {
      expect(helper.displayData).toHaveBeenCalled();
      done();
    });
  });

});
