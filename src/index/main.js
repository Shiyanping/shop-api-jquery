/**
 * Created by syp on 2017/3/2.
 */

$(function () {
    var index = {
        init: function () {
            this.bindEvent();
            methods.request(config.bannerList, {}, 'POST', $.proxy(this.bannerList, this));
            methods.request(config.categoryList, {}, 'POST', $.proxy(this.categoryList, this));
            methods.request(config.positionProduct, {}, 'POST', $.proxy(this.positionProductList, this));
            methods.request(config.userCredit, {}, 'POST', $.proxy(this.getCredit, this));
        },
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        initSwiper: function () {
            var mySwiper = new Swiper('.swiper-container', {
                direction: 'horizontal',
                loop: true,
                speed: 500,
                autoplay: 2000,

                // 如果需要分页器
                pagination: '.swiper-pagination'
            });
        },
        initNav: function () {
            var navLiWidth = $('.nav li').css('width');
            var navWidth = (navLiWidth.substr(0, navLiWidth.length - 2) * 1) * ($('.nav li').length);
            $('.nav ul').css('width', navWidth/100 + 'rem');
        },
        bindEvent: function () {
            var _this = this;
            $(document).on('click', '.historyList', function () { //购买历史页面
                window.location.href = 'historyList.html';
            });

            $(document).on('click', '.category-item', function () { //分类列表页面
                var categoryId = $(this).data('id');
                if(location.href.indexOf('?') != -1) {
                    window.location.href = 'productList.html' + location.search + '&categoryId=' + categoryId;
                } else {
                    window.location.href = 'productList.html?categoryId=' + categoryId;
                }
            });

            $(document).on('click', '.all-product', function () { //全部产品列表页面
                window.location.href = 'productList.html';
            });

            $(document).on('click', '.product', function () { //商品详情页面
                var id = $(this).data('id');
                if(location.href.indexOf('?') != -1) {
                    window.location.href = 'productDetail.html' + location.search + '&id=' + id;
                } else {
                    window.location.href = 'productDetail.html?id=' + id;
                }
            });

            $(document).on('click', '.swiper-wrapper a', function () {
                var url = $(this).attr('href');
                var bannerIndex = $(this).parent().attr('data-swiper-slide-index') * 1 + 1;
            });
        },
        bannerList: function (data) {
            if (data.status == 200) {
                this.renderTpl('bannerListTpl', data, $('.swiper-wrapper'));
                this.initSwiper();
            }
        },
        categoryList: function (data) {
            if (data.status == 200) {
                this.renderTpl('categoryListTpl', data, $('.nav'));
                this.initNav();
            }
        },
        getCredit: function (data) {
            if (data.status == 200) {
                data.newCredit = parseFloat(data.credit / 100).toFixed(2);
                this.renderTpl('userCreditTpl', data, $('.money-num'));

                // 视觉优化，调用接口成功后显示兑换记录标签
                $('.history').show();
            }
        },
        positionProductList: function (data) {
            if (data.status == 200) {
                for (var i = 0; i < data.dataList.length; i++) {
                    if (data.dataList[i].tagsColor) {
                        data.dataList[i].tagsColor = methods.htmlDecodeByRegExp(data.dataList[i].tagsColor);
                    }
                    data.dataList[i].price = parseFloat(data.dataList[i].price).toFixed(2);
                    data.dataList[i].marketPrice = parseFloat(data.dataList[i].marketPrice).toFixed(2);
                }

                // 显示大家都在兑和查询所有商品按钮
                $('.more').show();
                $('.footer').show();
                this.renderTpl('positionListTpl', data, $('.hotList'));
            }
        }
    };
    index.init();
});