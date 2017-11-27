var Movie=require('../models/movie');

exports.index=function (req, res) {
        console.log("user session is");
        console.log(req.session.user);

        Movie.fetch(function (err, movies) {
            if(err){
                console.log(err);
            }
            res.render('index', {
                title: 'movies 首页',
                movies: movies
            })
        });
};
