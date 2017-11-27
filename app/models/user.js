var mongoose=require('mongoose');
var UserSchema=require('../schemas/user');
var User=mongoose.model('User',UserSchema);//编译模型,将该Schema发布为Model,导出构造函数User

module.exports=User;