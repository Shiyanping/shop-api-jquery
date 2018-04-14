/**
 * Created by syp on 2017/3/2.
 */

$(function () {
    var historyList = {
        init: function () {
            this.bindEvent();
            methods.request(config.historyList, this.historyList, 'POST', this.historyListCb);
        },
        historyList: {
            orderId: ''
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
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        bindEvent: function () {
            var _this = this;
            $(document).on('click', '.historyDetail', function () {
                var orderId = $(this).closest('.product').data('id');
                location.href = 'historyDetail.html' + location.search + '&orderId=' + orderId;
            });

            $(document).on('click', '.deliveryComment', function () {
                var _that = $(this);

                _this.doubleBtnTips('温馨提示', '是否确认收货', '确定', '取消', function () {
                    var productHeader = _that.closest('.product-btn').siblings('.product-header');
                    var orderId = _that.closest('.product').data('id');
                    _this.historyList.orderId = orderId;
                    methods.request(config.confirmProduct, _this.historyList, 'POST', function (data) {
                        if (data.code == 200) {
                            productHeader.append(' <span class="product-evaluation">未评价</span>');
                            productHeader.children('span').eq(1).text('交易完成');
                            _that.text('去评价').removeClass('deliveryComment').addClass('goComment');
                            _this.doubleBtnTips('温馨提示', '收到宝贝可否满意，去评价下吧？', '去评价', '取消', function () {
                                location.href = 'evaluation.html' + location.search + '&orderId=' + orderId;
                            });
                        }
                    });
                });
            });

            $(document).on('click', '.goComment', function () {
                var _that = $(this);
                _this.doubleBtnTips('温馨提示', '收到宝贝可否满意，去评价下吧？', '去评价', '取消', function () {
                    var orderId = _that.closest('.product').data('id');
                    location.href = 'evaluation.html' + location.search + '&orderId=' + orderId;
                });
            });

            $('.gohome').on('click', function () {
                location.href = 'index.html' + location.search;
            });
        },
        historyListCb: function (data) {
            var _this = historyList;
            if (data.dataList && data.dataList.length > 0) {
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].time) {
                        data.dataList[i].time = methods.dateFormat(new Date(data.dataList[i].time), 'yyyy-MM-dd hh:mm:ss');
                        data.dataList[i].price = parseFloat(data.dataList[i].price).toFixed(2);
                    }

                    if (data.dataList[i].productValue) {
                        data.dataList[i].deductionsValue = data.dataList[i].productValue - data.dataList[i].value
                        data.dataList[i].value = parseFloat(data.dataList[i].value).toFixed(2);
                    }

                    if (!data.dataList[i].image != "") {
                        if (data.dataList[i].type == "0" || data.dataList[i].type == "4" || data.dataList[i].type == "16" || data.dataList[i].type == "17") {
                            data.dataList[i].image = "images/7.jpg";
                        } else if (data.dataList[i].type == "1") {
                            data.dataList[i].image = "images/2.jpg";
                        } else if (data.dataList[i].type == "2" || data.dataList[i].type == "13" || data.dataList[i].type == "15" || data.dataList[i].type == "20") {
                            data.dataList[i].image = "images/1.jpg";
                        } else if (data.dataList[i].type == "3") {
                            data.dataList[i].image = "images/4.jpg";
                        } else if (data.dataList[i].type == "8") {
                            data.dataList[i].image = "images/5.jpg";
                        } else if (data.dataList[i].type == "11") {
                            data.dataList[i].image = "images/6.jpg";
                        } else if (data.dataList[i].type == "12") {
                            data.dataList[i].image = "images/3.jpg";
                        } else if (data.dataList[i].type == "14") {
                            data.dataList[i].image = "images/9.jpg";
                        } else {
                            data.dataList[i].image = "images/2.jpg";
                        }
                    }
                }
                _this.renderTpl('historyListTpl', data, $('#content'));
            } else {
                $('.no-product').show();
            }
        }
    };
    historyList.init();
});