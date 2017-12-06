var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function (req, res) {
    console.log("user session is");
    console.log(req.session.user);

    Category
        .find({})
        .populate({path: 'movies', select:'title poster',options: {limit: 5}})
        .exec(function (err, categories) {
            if (err) {
                console.log(err);
            }
            res.render('index', {
                title: 'movies 首页',
                categories: categories
            })
        });
};

exports.search = function (req, res) {
    var catId = req.query.cat;
    var q=req.query.q;
    var page = parseInt(req.query.p,10)||0;
    var count=2;
    var index = page * count;

    //通过分类页过来的请求
    if(catId){
        Category
            .find({_id:catId})
            .populate({
                path: 'movies',
                select:'title poster'
                // options: {limit: 2,skip:index}
            })
            .exec(function (err, categories) {
                if (err) {
                    console.log(err);
                }
                var category=categories[0]||{};
                var movies=category.movies||[];
                console.log(category);
                var results=movies.slice(index,index+count);
                console.log(results);
                res.render('results', {
                    title: 'movies 分类列表页',
                    keyword:category.name,
                    currentPage:(page+1),
                    query:'cat='+catId,
                    totalPage:Math.ceil(movies.length/count),
                    movies:results
                })
            });
    }else{
        Movie
            .find({title:new RegExp(q+'.*','i')})
            .exec(function (err, movies) {
                if (err) {
                    console.log(err);
                }

                var results=movies.slice(index,index+count);
                console.log(results);
                res.render('results', {
                    title: 'movies 搜索结果页',
                    keyword:q,
                    currentPage:(page+1),
                    query:'q='+q,
                    totalPage:Math.ceil(movies.length/count),
                    movies:results
                })
            })
    }

};

