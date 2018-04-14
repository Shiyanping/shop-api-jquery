/**
 * Created by syp on 2017/3/5.
 */
$(function () {
    var productDetail = {
        init: function () {
            this.bindEvent();
            this.productDetail.id = methods.getUrlParam(location.href, 'id');
            methods.request(config.productDetail, this.productDetail, 'POST', this.productDetailCb);
        },
        productDetail: {
            id: '',
            minId: '',
            minTime: ''
        },
        productCredit: '',
        checkCanBuy: {
            productId: null
        },
        userInfo: {
            type: 1, //1是支付宝
            name: '',
            idCard: '',
            account: '',
            hasBefore: false
        },
        // 商品信息
        productInfo: {},
        // 判断微信和支付宝是直接购买还是修改信息  1直接购买，2跳转下单页
        buyType: 2,
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        appendTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.append(html);
        },
        subStr: function (str) {
            str = str + '';
            var newStr = str.substr(str.length - 4);
            var Str = '***' + newStr;
            return Str;
        },
        singleBtnTips: function (title, content, footer, btnCallback) {
            $('#single_modal_tit').html(title);
            $('#single_modal_info').html(content);
            $('#single_modal_btn').html(footer);
            $('#singleBtnModal').show();
            $('#single_modal_btn').on('click', function () {
                $('#singleBtnModal').hide();
                btnCallback && btnCallback();
            });
        },
        bindEvent: function () {
            var _this = this;
            $(document).on('click', '.buyBtn', function () { //下单功能
                _this.buyType = 1;
                methods.request(config.checkCanBuy, _this.checkCanBuy, 'POST', _this.checkCanBuyCallback);
            });

            $(document).on('click', '.update-user-info', function () { //下单功能
                methods.request(config.checkCanBuy, _this.checkCanBuy, 'POST', _this.checkCanBuyCallback);
            });

            $(document).on('click', '.product-detail-tabTitle', function () {
                var top = document.body.scrollTop || document.documentElement.scrollTop;
                $(this).addClass('titleColor');
                $(this).siblings('li').removeClass('titleColor');
                $(this).children('div').addClass('lineShow');
                $(this).siblings('li').children('div').removeClass('lineShow');
                var $this = $(this);
                itemIndex = $this.index();
                $('.descShow').eq(itemIndex).show().siblings('.descShow').hide();

                var show = $('#tab2').css('display');
                if (show == 'block') {
                    $('html,body').animate({
                        scrollTop: top
                    }, 100, 'linear');
                    _this.productDetail.minId = null;
                    _this.productDetail.minTime = null;
                    methods.request(config.commentLsit, _this.productDetail, 'GET', _this.commentList);
                }
            });
        },
        // 获取用户是否提过现
        getPersonId: function () {
            var _this = productDetail;
            _this.userInfo.type = _this.productInfo.type == 6 || _this.productInfo.type == 7 ? 2 : 1;

            methods.request(config.personalID, {
                "type": _this.userInfo.type
            }, 'POST', function (res) {
                if (res.hasBefore) {
                    _this.userInfo.hasBefore = res.hasBefore;
                    _this.userInfo.name = res.userName && res.userName != '' ? res.userName : '';
                    _this.userInfo.account = res.account && res.account != '' ? res.account : '';
                    _this.getPersonalInformation();
                }
            });
        },
        // 获取用户提现过的用户信息
        getPersonalInformation: function () {
            var _this = productDetail;

            methods.request(config.personalInformation, {}, 'POST', function (res) {
                if (res.idCard != '' && res.userName != '') {
                    _this.userInfo.idCard = res.idCard.replace(/\-/g, '');
                } else {
                    // 如果在已经提现的前提下没有用户信息，就将用户提现状态变为未提现，防止后台报错
                    _this.userInfo.hasBefore = false;
                }
                _this.renderTpl('userInfoTpl', _this.userInfo, $('.user-info'));
            });
        },
        productDetailCb: function (data) {
            var _this = productDetail;

            _this.productInfo = data.data;

            data.data.marketPrice = parseFloat(data.data.marketPrice).toFixed(2);

            _this.productCredit = data.data.price; //记录商品所需积分

            if (data.data.desc) {
                data.data.desc = methods.htmlDecodeByRegExp(data.data.desc);
            }

            if (data.data.taskProperty) {
                data.data.taskProperty = JSON.parse(data.data.taskProperty);
            }

            _this.renderTpl('productTpl', data.data, $('.product'));
            methods.request(config.userCredit, {}, 'POST', _this.getCreditCb); //查询用户积分

            // 支付宝查询用户是否提过现
            if (data.data.type == 2 || data.data.type == 20) {
                _this.getPersonId();
            }
        },
        commentList: function (data) {
            var _this = productDetail;
            var api = config.commentLsit;
            var minId = data.minId;
            var minTime = data.minTime;
            $('#minId').val(minId);
            $('#minTime').val(minTime);
            $.each(data.dataList, function () {
                var time = Number(this.time);
                this.time = methods.dateFormat(new Date(time), 'yyyy-MM-dd');
                this.userId = _this.subStr(this.userId);
            });
            if (data.dataList.length > 0) {
                $('.product-assessList').empty();
                $('.dropload-down').remove();
                _this.renderTpl('commentListTpl', data, $('.product-assessList'));
                $(window).scroll(function () {
                    if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                        minId = $('#minId').val();
                        minTime = $('#minTime').val();
                        if ($('.dropload-down').length < 1) {
                            $('.product-assess').dropload({
                                scrollArea: window,
                                domUp: {
                                    domClass: 'dropload-up',
                                    domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                                    domUpdate: '<div class="dropload-update">↑释放更新</div>',
                                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中</div>'
                                },
                                domDown: {
                                    domClass: 'dropload-down',
                                    domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中</div>',
                                    domNoData: '<div class="dropload-noData">暂无数据</div>'
                                },
                                loadDownFn: function (me) {
                                    _this.productDetail.minId = minId
                                    _this.productDetail.minTime = minTime
                                    methods.request(api, _this.productDetail, 'GET', commentList);

                                    function commentList(data) {
                                        minId = data.minId;
                                        minTime = data.minTime;
                                        if (data.dataList.length > 0) {
                                            $.each(data.dataList, function () {
                                                var time = Number(this.time);
                                                this.time = methods.dateFormat(new Date(time), 'yyyy-MM-dd');
                                                this.userId = _this.subStr(this.userId);
                                            });
                                            _this.appendTpl('commentListTpl', data, $('.product-assessList'));

                                        } else {
                                            me.lock();
                                            me.noData();
                                        }
                                        me.resetload();
                                    }
                                },
                                threshold: 50
                            });
                        }
                    }
                });
            } else {
                $('.product-assessList').empty();
                $('.product-assessList').append('<p class=\'product-assess-noData\'>暂时没有评价，快去兑换吧</p>');
            }
        },
        getCreditCb: function (data) {
            var _this = productDetail;

            if (data.status == 200) {
                if (_this.productInfo.status == 0) {
                    data.enough = '下架';
                } else if (_this.productInfo.status == 1 && _this.productInfo.stock == 0) {
                    data.enough = '无货';
                } else {
                    data.enough = data.credit - _this.productCredit * 100; //查看用户积分是否充足
                }
                data.newCredit = parseFloat(data.credit / 100).toFixed(2);
                _this.renderTpl('userCreditTpl', data, $('.footer'));
            }
        },
        checkCanBuyCallback: function (data) {
            // 不同错误码处理
            var _this = productDetail;
            if (data.status == 200) {
                if (_this.userInfo.hasBefore && _this.buyType == 1) {
                    // 如果已经有提现记录则直接下单
                    switch (_this.productInfo.type) {
                        case 2:
                            // 大额支付宝
                            _this.alipayWithdraw();
                            break;
                        case 20:
                            // 小额支付宝
                            _this.alipayWithdraw();
                            break;
                    }
                } else {
                    location.href = 'createOrder.html' + location.search + '&id=' + _this.productDetail.id;
                }
            } else {
                _this.singleBtnTips('温馨提示', data.message, '知道了');
            }
        },
        alipayWithdraw: function () {
            var _this = productDetail;
            methods.request(config.orderCreate, {
                "productId": _this.productInfo.id,
                "realName": _this.userInfo.name,
                "rechargeAccount": _this.userInfo.account,
                "idCard": _this.userInfo.idCard
            }, 'POST', _this.createOrderSuccess);
        },
        createOrderSuccess: function (data) {
            //确认订单时的提示
            var _this = productDetail;
            if(data.code == 200) {
                _this.singleBtnTips('温馨提示', '购买成功', '确定', function() {
                    window.location.href = 'historyList.html' + location.search;
                });
            } else {
                _this.singleBtnTips('温馨提示', data.message, '知道了');
            }
        }
    };
    productDetail.init();
});