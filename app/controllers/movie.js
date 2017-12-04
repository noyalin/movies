var Movie = require('../models/movie');
var Category = require('../models/category');
var Comment = require('../models/comment');
var _ = require('underscore');

//detail page
exports.detail = function (req, res) {
    var id = req.params.id;
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
                    categories:categories
                })
            })
        })
    }
};

//admin post movie 从后台录入页post过来的数据
exports.save = function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
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
        var category = _movie.category;

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            Category.findById(category, function (err, category) {
                category.movies.push(movie._id);
                category.save(function (err, category) {
                    if (err) {
                        console.log(err)
                    }
                })
            });
            //储存成功后将路径重定向至详情页
            res.redirect('/movie/' + movie._id);
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