/**
 * Created by Administrator on 2017/4/26.
 */

$(function () {
    var evaluation = {
        init: function () {
            this.bindEvent();
            this.evaluation.orderId = methods.getUrlParam(location.href, 'orderId');
            methods.request(config.evaluate, this.evaluation, 'GET', this.evaluation);
        },
        evaluation: {
            orderId: '',
            productId: '',
            score: '',
            comment: ''
        },
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        singleBtnTips: function (title, content, footer, callback) { //1
            $('#single_modal_tit').html(title);
            $('#single_modal_info').html(content);
            $('#single_modal_btn').html(footer);
            $('#singleBtnModal').show();
            $('#single_modal_btn').on('click', function () {
                $('#singleBtnModal').hide();
                callback && callback();
            });
        },
        doubleBtnTips: function (title, content, btn, btn1, callback) {
            $('#double_modal_tit').html(title);
            $('#double_modal_info').html(content);
            $('#double_modal_btn').html(btn);
            $('#double_modal_btn1').html(btn1);
            $('#doubleBtnModal').show();
            $('#double_modal_btn').off().on('click', function () {
                $('#doubleBtnModal').hide();
                callback && callback();
            });
            $('#double_modal_btn1').off().on('click', function () {
                $('#doubleBtnModal').hide();
            });
        },
        evaluation: function (data) {
            var _this = evaluation;

            _this.evaluation.productId = data.productId;

            _this.renderTpl('evaluationTpl', data, $('.evaluation-header'));
        },
        bindEvent: function () {
            var _this = this;
            $(document).on('click', '.success', function () {
                var comment = $('.text').val();
                var textLength = comment.length;
                if (textLength < 10 || textLength > 100) {
                    _this.singleBtnTips('温馨提示', '评论格式不正确', '确定');
                } else {
                    _this.doubleBtnTips('温馨提示', '确定提交评价？', '提交', '取消', function () {
                        var score = $('.score').val();
                        _this.evaluation.comment = comment;
                        _this.evaluation.score = score;
                        methods.request(config.confirmComment, _this.evaluation, 'POST', function (data) {
                            if (data.code == 200) {
                                _this.singleBtnTips('温馨提示', '评论发表成功', '确定');
                                setTimeout(function () {
                                    location.href = 'historyList.html' + location.search;
                                }, 3000);
                            }
                        });
                    });
                }
            });

            $(document).on('click', '.fail', function () {
                _this.doubleBtnTips('温馨提示', '放弃评价？', '放弃', '取消', function () {
                    history.go(-1);
                });
            });

            $(document).on('click', '.star', function () {
                var starData = $(this).data('id');
                var starContext = $('.scoreStatus');
                var stars = $('.starBase');
                stars.removeClass('noStar');
                for (var i = stars.length - 1; i > starData - 1; i--) {
                    stars.eq(i).addClass('noStar');
                }

                switch (doubleBtnTips) {
                    case 1:
                        starContext.html('很不好');
                        break;
                    case 2:
                        starContext.html('有瑕疵');
                        break;
                    case 3:
                        starContext.html('一般');
                        break;
                    case 4:
                        starContext.html('比较好');
                        break;
                    default:
                        starContext.html('非常好');
                        break;
                }

                $('.score').val(starData)
            })
        },
    };
    evaluation.init();
});