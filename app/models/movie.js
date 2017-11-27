var mongoose=require('mongoose');
var MovieSchema=require('../schemas/movie');
var Movie=mongoose.model('Movie',MovieSchema);//编译模型,将该Schema发布为Model,导出构造函数movie

module.exports=Movie;