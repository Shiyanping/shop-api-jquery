$(function () {
    var createOrder = {
        init: function () {
            this.bindEvent();
            this.initArea();
            methods.request(config.confirmDetail, this.confirmOrder, 'POST', this.confirmOrder);
        },
        confirmOrder: {
            id: ''
        },
        productType: null,
        alipayParams: {
            productId: '',
            realName: '',
            rechargeAccount: '',
            idCard: ''
        },
        flowParams: { //流量和Q币参数
            productId: '',
            rechargeAccount: ''
        },
        productParams: {
            productId: '',
            name: '',
            region: '',
            street: '',
            detail: '',
            mobile: ''
        },
        product: '',
        isShowIdCard: true,
        personalIDParams: {
            type: 1
        },
        checkReg: {
            emailFilter: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            telFilter: /^1[345678]\d{9}$/,
            isIDCard2: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
            QQ: /^\d{5,10}$/,
            regName: /^[\u4e00-\u9fa5]{2,8}$/
        },
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        singleBtnTips: function (title, content, footer, callback) {
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
        initArea: function () {
            var area = new LArea();
            area.init({
                'trigger': '#addr', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
                'valueTo': '#addr_val', //选择完毕后id属性输出到该位置
                'keys': {
                    id: 'id',
                    name: 'name'
                }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
                'type': 1, //数据源类型
                'data': LAreaData //数据源
            });
        },
        bindEvent: function () {
            var _this = this;

            $(document).on('click', '.buyBtn', function () {
                if (_this.productType == 1) { //实物
                    _this.productParams.name = $('.info-content-product input[name="userName"]').val();
                    _this.productParams.mobile = $('.info-content-product input[name="userMobile"]').val();
                    _this.productParams.region = $('#addr').val();
                    _this.productParams.street = $('.info-content-product input[name="street"]').val();
                    _this.productParams.detail = $('.info-content-product input[name="address"]').val();
                    if (_this.productParams.name == '' || _this.productParams.mobile == '' || _this.productParams.region == '' || _this.productParams.street == '' || _this.productParams.detail == '') {
                        _this.singleBtnTips('温馨提示', '请完整填写信息', '知道了');
                    } else if (!_this.checkReg.telFilter.test(_this.productParams.mobile)) {
                        _this.singleBtnTips('温馨提示', '请填写正确的手机号', '知道了');
                    } else {
                        //确认购买提示语
                        var tips = "<p>收件人：" + _this.productParams.name + "</p>" +
                            "<p>联系电话：" + _this.productParams.mobile + "</p>" +
                            "<p>地址：" + _this.productParams.region + ',' + _this.productParams.street + "</p>" +
                            "<p>详细地址：" + _this.productParams.detail + "</p>" +
                            "<p>金额：" + $('.sum b').text() + "</p>";
                        _this.doubleBtnTips('确认兑换信息', tips, '确定', '取消', _this.createProductOrder);
                    }
                } else if (_this.productType == 2 || _this.productType == 20) { //支付宝提现
                    _this.alipayParams.realName = methods.trim($('.info-content-alipay input[name="userName"]').val(), "g");
                    _this.alipayParams.rechargeAccount = methods.trim($('.info-content-alipay input[name="userAlipay"]').val(), "g");
                    _this.alipayParams.idCard = _this.alipayParams.idCard == '' ? methods.trim($('.info-content-alipay input[name="userCard"]').val(), "g") : _this.alipayParams.idCard;
                    if (_this.alipayParams.realName == '' || _this.alipayParams.rechargeAccount == '' || (_this.alipayParams.idCard == '' && _this.isShowIdCard)) {
                        _this.singleBtnTips('温馨提示', '请完整填写信息', '知道了');
                    } else if (!_this.checkReg.telFilter.test(_this.alipayParams.rechargeAccount) && !_this.checkReg.emailFilter.test(_this.alipayParams.rechargeAccount)) {
                        _this.singleBtnTips('温馨提示', '请填写正确的支付宝账号', '知道了');
                    } else if (!_this.checkReg.isIDCard2.test(_this.alipayParams.idCard.replace(/\-/g, '')) && _this.isShowIdCard) {
                        _this.singleBtnTips('温馨提示', '请填写正确的身份证号码', '知道了');
                    } else {
                        var tips = '';
                        var isShowModelCard = $('.info-content-alipay').find('.idCard').css('display');
                        if (isShowModelCard == 'none') { // 不显示身份证号
                            if (_this.alipayParams.realName == '') {
                                tips = "<p>支付宝号：" + _this.alipayParams.rechargeAccount + "</p>" +
                                    "<p>金额：" + $('.sum b').text() + "</p>";
                            } else {
                                tips = "<p>真实姓名：" + _this.alipayParams.realName + "</p>" +
                                    "<p>支付宝号：" + _this.alipayParams.rechargeAccount + "</p>" +
                                    "<p>金额：" + $('.sum b').text() + "</p>";
                            }
                        } else {
                            if (_this.alipayParams.realName == '') {
                                tips = "<p>支付宝号：" + _this.alipayParams.rechargeAccount + "</p>" +
                                    "<p>身份证号：" + _this.alipayParams.idCard + "</p>" +
                                    "<p>金额：" + $('.sum b').text() + "</p>";
                            } else {
                                tips = "<p>真实姓名：" + _this.alipayParams.realName + "</p>" +
                                    "<p>支付宝号：" + _this.alipayParams.rechargeAccount + "</p>" +
                                    "<p>身份证号：" + _this.alipayParams.idCard + "</p>" +
                                    "<p>金额：" + $('.sum b').text() + "</p>";
                            }
                        }
                        _this.doubleBtnTips('确认兑换信息', tips, '确定', '取消', _this.createProductOrder);
                    }
                } else if (_this.productType == 3 || _this.productType == 12) { //流量 or 话费
                    _this.flowParams.rechargeAccount = methods.trim($('.info-content-flow input[name="userMobile"]').val(), "g");
                    if (_this.flowParams.rechargeAccount == '') {
                        _this.singleBtnTips('温馨提示', '请完整填写信息', '知道了');
                    } else if (!_this.checkReg.telFilter.test(_this.flowParams.rechargeAccount)) {
                        _this.singleBtnTips('温馨提示', '请填写正确的手机号', '知道了');
                    } else {
                        var tips = "<p>手机号：" + _this.flowParams.rechargeAccount + "</p>" +
                            "<p>金额：" + $('.sum b').text() + "</p>";
                        _this.doubleBtnTips('确认兑换信息', tips, '确定', '取消', _this.createProductOrder);
                    }
                } else if (_this.productType == 8) { //Q币
                    _this.flowParams.rechargeAccount = methods.trim($('.info-content-qb input[name="userQQ"]').val(), "g");
                    if (_this.flowParams.rechargeAccount == '') {
                        _this.singleBtnTips('温馨提示', '请完整填写信息', '知道了');
                    } else if (!_this.checkReg.QQ.test(_this.flowParams.rechargeAccount)) {
                        _this.singleBtnTips('温馨提示', '请填写正确的QQ号', '知道了');
                    } else {
                        var tips = "<p>QQ号：" + _this.flowParams.rechargeAccount + "</p>" +
                            "<p>金额：" + $('.sum b').text() + "</p>";
                        _this.doubleBtnTips('确认兑换信息', tips, '确定', '取消', _this.createProductOrder);
                    }
                }
            });
        },
        confirmOrder: function (data) {
            var _this = createOrder;

            if (data.status == 200) {
                //根据不同的商品类型显示不一样的确认框
                _this.productType = data.data.type;

                data.data.price = parseFloat(data.data.price).toFixed(2);

                _this.renderTpl('orderInfoTpl', data.data, $('.product-info'));
                _this.renderTpl('footerTpl', data.data, $('.footer'));

                //新闻赚商品价格小于10元的微信提现和支付宝提现不显示身份证号
                if (parseInt(data.data.price) <= 10) {
                    $('.idCard').hide();
                    _this.isShowIdCard = false;
                } else {
                    _this.isShowIdCard = true;
                }

                //根据不同的商品类型显示不一样的确认框
                if (data.data.type == 1) { //实物
                    $('.info-content-product').show().siblings().hide();
                    methods.request(config.getAddress, {}, 'POST', _this.getAddress);
                    $('.info-title').html('收货信息<span style="font-size: .12rem;color: #151515;line-height: .22rem;">（可修改）</span>');
                } else if (data.data.type == 2 || data.data.type == 20) { //支付宝
                    // 判断是否有用户信息
                    methods.request(config.personalInformation, _this.publicParams, 'POST', function (res) {
                        // 判断是否已经提过现
                        _this.getPersonId();

                        if (res.idCard != '') {
                            _this.alipayParams.idCard = res.idCard.replace(/\-/g, '');
                            $('.info-content-alipay').find('.idCard').hide();
                        }

                        $('.info-content-alipay').show().siblings().hide();
                        $('.info-title').html('收货信息：');
                    });
                } else if (data.data.type == 3 || data.data.type == 12) { //流量
                    $('.info-content-flow').show().siblings().hide();
                    $('.info-title').html('收货信息：');
                } else if (data.data.type == 8) { //Q币
                    $('.info-content-qb').show().siblings().hide();
                    $('.info-title').html('收货信息：');
                }
            } else {
                _this.singleBtnTips('温馨提示', '网络异常，请稍后重试', '知道了');
            }
        },
        // 判断用户是否提过现
        getPersonId: function () {
            var _this = createOrder;
            methods.request(config.personalID, _this.personalIDParams, 'POST', function (res) {
                if (res.hasBefore) {
                    $('.info-content-alipay').find('input[name="userName"]').val(res.userName);
                    $('.info-content-alipay').find('input[name="userAlipay"]').val(res.account);
                }
            });
        },
        getAddress: function (data) { //实物二次购买数据回显
            if (data.region) {
                $('#addr').val(data.region);
                $('.info-content-product input[name="street"]').val(data.street);
                $('.info-content-product input[name="address"]').val(data.detail);
                $('.info-content-product input[name="userName"]').val(data.name);
                $('.info-content-product input[name="userMobile"]').val(data.mobile);
            }
        },
        createAlipayOrder: function () {
            var _this = createOrder;
            methods.request(config.orderCreate, _this.alipayParams, 'POST', _this.createOrderSuccess);
        },
        createProductOrder: function () {
            var _this = createOrder;
            methods.request(config.orderCreate, _this.productParams, 'POST', _this.createOrderSuccess);
        },
        createFlowOrder: function () {
            var _this = createOrder;
            methods.request(config.orderCreate, _this.flowParams, 'POST', _this.createOrderSuccess);
        },
        createOrderSuccess: function (data) {
            //确认订单时的提示
            var _this = createOrder;
            if (data.code == 200) {
                _this.singleBtnTips('温馨提示', '购买成功', '确定', function () {
                    window.location.href = 'historyList.html' + location.search;
                });
            } else {
                _this.singleBtnTips('温馨提示', data.message, '知道了');
            }
        }
    };
    createOrder.init();
});