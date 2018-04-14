/**
 * Created by syp on 2017/3/6.
 */

$(function () {
    var historyDetail = {
        init: function () {
            this.bindEvent();
            this.historyDetailParams.orderId = methods.getUrlParam(location.href, 'orderId');
            methods.request(config.historyDetail, this.historyDetailParams, 'POST', this.historyDetailCb);
        },
        historyDetailParams: {
            orderId: '',
        },
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        replaceIdCard: function (str) {
            str = str.split('');
            if (str.length == 18) {
                str.splice(6, 8, '********');
            } else {
                str.splice(6, 6, '******');
            }
            str = str.join('');
            return str;
        },
        replaceName: function (str) {
            var length = str.length;
            var tempStr = '';
            for (var i = 0; i < length - 1; i++) {
                tempStr += '*';
            }
            str = str.substr(0, 1) + tempStr;
            return str;
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
        historyDetailCb: function (data) {
            var _this = historyDetail;

            data.remark = JSON.parse(data.remark);

            if (!data.image != "") {
                if (data.type == "0" || data.type == "4" || data.type == "16" || data.type == "17") {
                    data.image = "images/7.jpg";
                } else if (data.type == "1") {
                    data.image = "images/2.jpg";
                } else if (data.type == "2" || data.type == "13" || data.type == "15" || data.type == "20") {
                    data.image = "images/1.jpg";
                } else if (data.type == "3") {
                    data.image = "images/4.jpg";
                } else if (data.type == "8") {
                    data.image = "images/5.jpg";
                } else if (data.type == "11") {
                    data.image = "images/6.jpg";
                } else if (data.type == "12") {
                    data.image = "images/3.jpg";
                } else if (data.type == "14") {
                    data.image = "images/9.jpg";
                } else {
                    data.image = "images/2.jpg";
                }
            }

            if (data.time) {
                data.time = methods.dateFormat(new Date(data.time), 'yyyy-MM-dd hh:mm:ss');
                data.price = parseFloat(data.price).toFixed(2);
            }

            if (data.value) {
                data.value = parseFloat(data.value).toFixed(2);
            }

            //将身份证号中的年月日替换为*
            if (data.remark.idCard) {
                data.remark.idCard = _this.replaceIdCard(data.remark.idCard);
            }

            //将名字中除第一位替换为*
            if (data.remark.realName) {
                data.remark.realName = _this.replaceName(data.remark.realName);
            }

            if (data.remark.name) {
                data.remark.name = _this.replaceName(data.remark.name);
            }

            if (data.type == 1) {
                $('.order-info-product').show().siblings().hide();
                _this.renderTpl('productTpl', data, $('.order-info-product'));
            } else if (data.type == 2 || data.type == 20) {
                $('.order-info-ailpay').show().siblings().hide();
                _this.renderTpl('alipayTpl', data, $('.order-info-ailpay'));
            } else if (data.type == 3 || data.type == 12) {
                $('.order-info-flow').show().siblings().hide();
                _this.renderTpl('flowTpl', data, $('.order-info-flow'));
            }

            _this.renderTpl('productInfoTpl', data, $('.product'));
        },
        bindEvent: function () {
            var _this = this
            $(document).on('click', '.deliveryComment', function () {
                var orderId = $(this).parent().data('id');
                var _that = $(this);
                _this.doubleBtnTips('温馨提示', '是否确认收货', '确定', '取消', function () {
                    _this.historyDetailParams.orderId = orderId;
                    methods.request(config.confirmProduct, _this.historyDetailParams, 'POST', function (data) {
                        if (data.code == 200) {
                            _that.html('去评价').removeClass('deliveryComment').addClass('goComment');
                            _this.doubleBtnTips('温馨提示', '收到宝贝可否满意，去评价下吧？', '去评价', '取消', function () {
                                location.href = 'evaluation.html' + location.search;
                            });
                        }
                    });
                });
            });

            $(document).on('click', '.goComment', function () {
                var orderId = $(this).parent().data('id');
                _this.doubleBtnTips('温馨提示', '收到宝贝可否满意，去评价下吧？', '去评价', '取消', function () {
                    location.href = 'evaluation.html' + location.search;
                });
            })
        },
        checkLotteryProduct: function (data) {
            $('.reward-name').text(data.data.name);
        }
    };
    historyDetail.init();
});