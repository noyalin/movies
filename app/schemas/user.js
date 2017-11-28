var mongoose = require("mongoose");
var bcrypt = require('bcrypt');//盐，用来和密码加密
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    //权限管理
    //0:normal user
    //1:vertified user
    //2:professional user

    //>10:admin
    //>50:super admin
    role:{
        type:Number,
        default:0
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

//实例方法
UserSchema.methods={
    //比对密码：将用户的明文密码和数据库加密的密码比较
    comparePassword:function (_password, cb) {
        bcrypt.compare(_password,this.password,function (err, isMatch) {
            //有错
            if(err) return cb(err);
            //无错
            cb(null,isMatch)
        })
    }
};

//每次存储数据之前调用save的方法
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isNew) {//如果是新的数据
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    //生成随机的盐
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            console.log(err);
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;//新的hash
            console.log("password： " + user.password);
            next();
        })
    });
    //调到下一个流程
     //next();//异步执行的
});

//静态方法不会直接与数据库进行交互，只有通过model模型编译调用，实例方法通过实例调用
UserSchema.statics = {
    //取出目前数据库的所有数据
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')//排序
            .exec(cb);//回调方法
    },
    //取出目前数据库的单条数据
    findById: function (id, cb) {
        return this
            .findOne({"_id": id})
            .exec(cb);//回调方法
    }
};

module.exports = UserSchema;