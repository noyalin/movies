$(function () {
    $('.del-user').click(function (e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        $.ajax({
            type: 'DELETE',
            url: '/admin/user/list?id=' + id,
            success:function (data) {
                if (data.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            }
        });
    })
});