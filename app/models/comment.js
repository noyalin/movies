var mongoose=require('mongoose');
var CommentSchema=require('../schemas/comment');
var Comment=mongoose.model('Comment',CommentSchema);//编译模型,将该Schema发布为Model,导出构造函数Comment

module.exports=Comment;