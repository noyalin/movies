var mongoose=require('mongoose');
var CategorySchema=require('../schemas/category');
var Category=mongoose.model('Category',CategorySchema);//编译模型,将该Schema发布为Model,导出构造函数Category

module.exports=Category;