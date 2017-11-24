/**
 * Created by Dell on 2017/11/17.
 */
var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var Movie=require('./models/movie');
var User=require('./models/User');
var mongoose=require('mongoose');
var _=require('underscore');
var bodyParser = require('body-parser');
var app = express();

mongoose.connect('mongodb://localhost/movie');
/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    console.log('连接DB成功');
});
/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

app.set('views', './views/pages');//设置视图所在目录
app.set('view engine', 'jade');//设置视图模板
app.use(bodyParser.json());

// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
/*
 bodyParser.urlencoded（）
* 返回一个处理urlencoded数据的中间件。
* 这个方法默认使用UTF-8编码，且支持gzip和deflate编码的数据压缩。
* 解析后，其后的所有的req.body中将会是一个键值对对象。
* */

/*
* extended - 当设置为false时，会使用querystring库解析URL编码的数据；
* 当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。
* 默认为true
* */
app.use(bodyParser.urlencoded({ extended: true }));

/*
*通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
*所有文件的路径都是相对于存放目录的，因此，存放静态文件的目录名不会出现在 URL 中。
*/
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源目录
app.locals.moment = require('moment');
app.listen(port);
console.log('start on port:' + port);

//index page
app.get('/', function (req, res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('index', {
            title: 'movies 首页',
            movies: movies
        })
    });
});

//signup
app.post('/user/signup',function (req, res) {
    var _user=req.body.user;
    //console.log(_user);

    //检测用户名是否已存在
    User.findOne({name:_user.name},function (err,user) {
        if(err){
            console.log(err);
        }
        console.log(user);
        if(user){
            console.log("用户名重复");
            return res.redirect("/");
        }else{
            var user=new User(_user);
            user.save(function (err, user) {
                if(err){
                    console.log(err)
                }
                console.log("注册成功！");
                res.redirect("/admin/userlist");

            })
        }
    });
});

//signin
app.post('/user/signin',function (req, res) {

    var _user=req.body.user;
    var name=_user.name;
    var password=_user.password;
    //console.log(_user);

    User.findOne({name:name},function (err,user) {
        if(err){
            console.log(err)
        }
        if(!user){
            return res.redirect("/");
        }

        //比对密码：将用户的明文密码和数据库加密的密码比较
        //user上的实例方法:comparePassword
        user.comparePassword(password,function (err, isMatch) {
            if(err){
                console.log(err)
            }
            if(isMatch){
                console.log("Password is matched");
                return res.redirect("/");
            }else {
                console.log("Password is not matched")
            }
        })
    })

});

//user list page
app.get('/admin/userlist', function (req, res) {
    User.fetch(function (err, users) {
        if(err){
            console.log(err);
        }
        res.render('userlist', {
            title: 'user list',
            users: users
        })
    });
});


//detail page
app.get('/movie/:id', function (req,res) {
    var id=req.params.id;
    Movie.findById(id,function (err, movie) {
        res.render('detail', {
            title: 'movies '+movie.title,
            movie: movie
        });
    })
});

//admin page
app.get('/admin/new', function (req, res) {
    res.render('admin', {
        title: 'movies 后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

//admin update movie
app.get('/admin/update/:id',function (req,res) {
    var id=req.params.id;
    if(id){
        Movie.findById(id,function (err, movie) {
            res.render('admin',{
                title:'movies 后台更新页',
                movie: movie
            })
        })
    }
});

//admin post movie 从后台录入页post过来的数据
app.post('/admin/movie/new',function (req,res){
    var id=req.body.movie._id;
    var movieObj=req.body.movie;
    var _movie;
    if(id!=="undefined"){
        Movie.findById(id,function (err, movie) {
            if(err){
                console.log(err);
            }

            //用新的字段替换老的字段
            _movie=_.extend(movie,movieObj);
            _movie.save(function (err, movie) {

                if(err){
                    console.log(err);
                }
                //储存成功后将路径重定向至详情页
                res.redirect('/movie/'+movie._id);
            })
        })
    }else {
        _movie=new Movie({
            director:movieObj.director,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        });
        
        _movie.save(function (err,movie) {
            if(err){
                console.log(err);
            }
            //储存成功后将路径重定向至详情页
            res.redirect('/movie/'+movie._id);
        })
    }
});

//list page
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if(err){
            console.log(err);
        }
        res.render('list', {
            title: 'movies list',
            movies: movies
        })
    });
});

//list delete movie
app.delete('/admin/list',function (req, res) {
    var id=req.query.id;
    if(id){
        Movie.remove({_id:id},function (err, movie) {
            if(err){
                console.log(err);
            }else {
                res.json(({success:1}))
            }
        })
    }
});