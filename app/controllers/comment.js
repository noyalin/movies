var Comment = require('../models/comment');


//comment从后台录入页post过来的数据
exports.save = function (req, res) {
    var _comment= req.body.comment;
    var movieId=_comment.movie;

    //点击头像回复情况下
    if(_comment.cid){
        Comment.findById(_comment.cid,function (err, comment) {
            var reply={
                from:_comment.from,
                to:_comment.tid,
                content:_comment.content
            };
            comment.reply.push(reply);

            comment.save(function (err, comment) {
                //console.log(comment)
                if (err) {
                    console.log(err);
                }
                //储存成功后将路径重定向至详情页
                res.redirect('/movie/' + movieId);
            })
        })
    }else{
        var comment = new Comment(_comment);

        comment.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            //储存成功后将路径重定向至详情页
            res.redirect('/movie/' + movieId);
        })
    }
};

