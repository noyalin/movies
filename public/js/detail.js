$(function () {
    $('.comment').click(function (e) {
        var target = $(this);
        var toId = target.data('tid');//主评论的用户id
        var commentId = target.data('cid');//主评论的comment id

        //连续点击不同头像情况
        if($('#toId').length>0){
            $('#told').val(toId);
        }else{
            //生成隐藏域
            $('<input>').attr({
                type: 'hidden',
                id:'toId',
                name: 'comment[tid]',
                value:toId
            }).appendTo('#commentForm');
        }
        if($('#commentId').length>0){
            $('#commentId').val(commentId);
        }else{
            //生成隐藏域
            $('<input>').attr({
                type: 'hidden',
                id:'commentId',
                name: 'comment[cid]',
                value:commentId
            }).appendTo('#commentForm');
        }


    })
});