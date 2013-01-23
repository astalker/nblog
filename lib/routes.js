
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
    app.get('/edit', nblog.checkAccess, nblog.edit);
    app.post('/edit', nblog.checkAccess, nblog.editpost);
    app.get('/del', nblog.checkAccess, nblog.del);
    app.get('/page/:p', nblog.page);
}