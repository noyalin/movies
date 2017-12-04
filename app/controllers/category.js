var Movie = require('../models/movie');
var Category = require('../models/category');
var _ = require('underscore');

//category_admin page
exports.new = function (req, res) {
    res.render('category_admin', {
        title: 'movie 后台分类录入页',
        category:{}
    });
};

//admin post movie 从后台录入页post过来的数据
exports.save = function (req, res) {
    var _category = req.body.category;

    //插入新的数据
    var category = new Category(_category);

    category.save(function (err, category) {
        if (err) {
            console.log(err);
        }
        //储存成功后将路径重定向至详情页
        res.redirect('/admin/category/list');
    })
};

//category list page
exports.list = function (req, res) {
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('categorylist', {
            title: 'user 分类列表页',
            categories: categories
        });
    });
};

