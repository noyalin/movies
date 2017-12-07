var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');


//detail page
exports.detail = function (req, res) {
    var id = req.params.id;

    //pv每次+1
    Movie.update({_id:id},{$inc:{pv:1}},function (err) {
        if (err) {
            console.log(err);
        }

    });
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie: id})
            .populate('from', 'name')//根据from查user表里的name返回给name
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                console.log(comments);
                res.render('detail', {
                    title: 'movies ' + movie.title,
                    movie: movie,
                    comments: comments
                })
            })
    })
};

//admin page
exports.new = function (req, res) {
    Category.find({}, function (err, categories) {
        res.render('admin', {
            title: 'movie 后台录入页',
            categories: categories,
            movie: {}
        });
    })
};


//admin update movie
exports.update = function (req, res) {
    var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find(id, function (err, categories) {
                res.render('admin', {
                    title: 'movies 后台更新页',
                    movie: movie,
                    categories: categories
                })
            })
        })
    }
};

//admin poster
exports.savePoster = function (req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;//获取文件路径
    var originalFilename=posterData.originalFilename;//文件的原始名字

    console.log(req.files);
    if(originalFilename){
        fs.readFile(filePath,function (err, data) {
            var timestamp=Date.now();//时间戳
            var type=posterData.type.split('/')[1];//文件类型
            var poster=timestamp+'.'+type;//新文件的名字
            //将新文件存在服务器的文件夹里
            //__dirname表示当前目录，即movie.js所在目录
            var newPath=path.join(__dirname,'../../public/upload/'+poster);
            //写入文件
            fs.writeFile(newPath,data,function (err) {
                req.poster=poster;
                next()
            })
        })
    }else{
        next()
    }
};

//admin post movie 从后台录入页post过来的数据
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    console.log(movieObj);

    if(req.poster){
        movieObj.poster=req.poster;
    }

    //已存在情况，更新修改
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }

            //用新的字段替换老的字段
            _movie = _.extend(movie, movieObj);

            _movie.save(function (err, movie) {

                if (err) {
                    console.log(err);
                }
                //储存成功后将路径重定向至详情页
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        //插入新的数据
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryname = movieObj.categoryName;

        console.log(movieObj);
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            if (categoryId) {//选择了已有的分类
                Category.findById(categoryId, function (err, category) {
                    category.movies.push(movie._id);

                    category.save(function (err, category) {
                        if (err) {
                            console.log(err)
                        }
                        //储存成功后将路径重定向至详情页
                        res.redirect('/movie/' + movie._id);
                    })
                });
            } else if (categoryname) {//手动填写分类
                var category = new Category({
                    name: categoryname,
                    movies: [movie._id]
                });
                category.save(function (err, category) {
                    movie.category = category._id;
                    //储存成功后将路径重定向至详情页
                    movie.save(function (err, movie) {
                        res.redirect('/movie/' + movie._id);
                    });
                })
            }

        })
    }
};

//list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: 'movies list',
            movies: movies
        })
    });
};

//list delete movie
exports.del = function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json(({success: 1}))
            }
        })
    }
};