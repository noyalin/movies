var User = require('../models/User');

//userlist

//showSignup
exports.showSignup = function (req, res) {
    res.render('signup', {
        title: '注册页面'
    })
};

exports.showSignin = function (req, res) {
    res.render('signin', {
        title: '登录页面'
    })
};


//signup
exports.signup = function (req, res) {
    var _user = req.body.user;
    //console.log(_user);

    //检测用户名是否已存在
    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        //console.log(user);
        if (user) {
            console.log("用户名重复");
            return res.redirect("/signin");
        } else {
            var user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                console.log("注册成功！");
                res.redirect("/");

            })
        }
    });
};


//signin
exports.signin = function (req, res) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;
    //console.log(_user);

    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect("/signup");
        }

        //比对密码：将用户的明文密码和数据库加密的密码比较
        //user上的实例方法:comparePassword
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                console.log("Password is matched");
                req.session.user = user;
                return res.redirect("/");
            } else {
                return res.redirect("/signin");
                console.log("Password is not matched");
            }
        })
    })

};

//logout
exports.logout = function (req, res) {
    delete req.session.user;
    delete res.locals.user;
    res.redirect('/')
};

//user list page
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: 'user list',
            users: users
        });
    });
};

//middleware for user
exports.signinRequired = function (req, res,next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect("/signin");
    }
    next();
};

exports.adminRequired = function (req, res,next) {
    var user = req.session.user;
    if (user.role<=10) {
        return res.redirect("/signin");
    }
    next();
};