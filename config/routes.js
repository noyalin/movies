var Index=require('../app/controllers/index');
var User=require('../app/controllers/user');
var Movie=require('../app/controllers/movie');

module.exports=function (app) {
    //预处理 pre handle user
    app.use(function (req, res,next) {
        //渲染页面的user
        var _user=req.session.user;
        res.locals.user = _user;
        next();
    });

    //Index
    app.get('/', Index.index);

    //User
    app.post('/user/signup',User.signup);
    app.post('/user/signin',User.signin);
    app.get('/logout',User.logout);
    app.get('/admin/userlist',User.list);


    //Movie
    app.get('/movie/:id',Movie.detail);
    app.get('/admin/movie',Movie.new);
    app.get('/admin/update/:id',Movie.update);
    app.post('/admin/movie/new',Movie.save);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list',Movie.del);
};

