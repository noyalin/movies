var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var session = require('express-session');
var mongoose=require('mongoose');
var MongoStore=require('connect-mongo')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveStatic=require('serve-static');

var app = express();
var dburl="mongodb://localhost/movie";

mongoose.connect(dburl,{useMongoClient: true});

app.set('views', './app/views/pages');//设置视图所在目录
app.set('view engine', 'jade');//设置视图模板
/*
 *通过 Express 内置的 express.static 可以方便地托管静态文件，例如图片、CSS、JavaScript 文件等。
 *所有文件的路径都是相对于存放目录的，因此，存放静态文件的目录名不会出现在 URL 中。
 */
app.use(serveStatic(path.join(__dirname, 'public')));//设置静态资源目录
app.use(cookieParser());


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
//parse application/json
app.use(bodyParser.json());

//持久化登陆
app.use(session({
    secret:'movie',//一个String类型的字符串，作为服务器端生成session的签名。
    store:new MongoStore({//session储存在mongo中，通过实例化一个connect-mongo进行连接。
        url:dburl,
        collection:'sessions',
        ttl: 1 * 24 * 60 * 60, // = 1 days. Default:14
    }),
    resave: false,////如果没有发生任何修改不储存session。
    saveUninitialized: false,//在存储一些新数据之前，不创建session
}));

//开发环境下：控制台打印log
var env=process.env.NODE_ENV||'development';
if("development"===env){
    app.set('showStackError',true);
    app.use(logger(':method:url:status'));
    app.locals.pretty=true;//格式化源码
    mongoose.set('debug',true);
}

require("./config/routes")(app);

app.locals.moment = require('moment');
app.listen(port);
console.log('start on port:' + port);

