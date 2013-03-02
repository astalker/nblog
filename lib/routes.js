
module.exports = function(app, nblog)
{
  app.get('/', nblog.index);
  app.get('/admin', nblog.checkAccess, nblog.admin);
  app.get('/login', nblog.login);
  app.post('/login', nblog.loginpost);
  app.get('/logout', nblog.checkAccess, nblog.logout);
  app.get('/:year/:month/:day/:title', nblog.article);
  app.get('/articles', nblog.articles);
  app.get('/add', nblog.checkAccess, nblog.add);
  app.post('/add', nblog.checkAccess, nblog.addpost);
  app.get('/add-page', nblog.checkAccess, nblog.addpage);
  app.post('/add-page', nblog.checkAccess, nblog.addpagepost);
  app.get('/edit', nblog.checkAccess, nblog.edit);
  app.post('/edit', nblog.checkAccess, nblog.editpost);
  app.get('/edit-page', nblog.checkAccess, nblog.editpage);
  app.post('/edit-page', nblog.checkAccess, nblog.editpagepost);
  app.get('/del', nblog.checkAccess, nblog.del);
  app.get('/delconfirm', nblog.checkAccess, nblog.delconfirm);
  app.get('/del-page', nblog.checkAccess, nblog.delpage);
  app.get('/del-page-confirm', nblog.checkAccess, nblog.delpageconfirm);
  app.get('/page/:p', nblog.page);
  app.get('/content/:c', nblog.content);
  app.get('/preferences', nblog.checkAccess, nblog.preferences);
  app.post('/save', nblog.checkAccess, nblog.save);
  app.get('/sitemap.xml', nblog.sitemap);
}