/**
 * Created by syp on 2017/3/2.
 */

$(function () {
    var productList = {
        init: function () {
            this.bindEvent();
            this.categoryList.categoryId = methods.getUrlParam(location.href, 'categoryId');
            if (this.categoryList.categoryId) {
                methods.request(config.categoryProductList, this.categoryList, 'POST', this.productList);
            } else {
                methods.request(config.productList, this.productList, 'POST', this.productList);
            }
        },
        categoryList: {
            categoryId: ''
        },
        productList: {
            pageNo: 1,
            pageSize: 20
        },
        renderTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.html(html);
        },
        appendTpl: function (tpl, data, obj) {
            var html = template(tpl, data);
            obj.append(html);
        },
        bindEvent: function () {
            var _this = productList;
            $(document).on('click', '.product', function () {
                var id = $(this).data('id');
                if (location.href.indexOf('?') != -1) {
                    window.location.href = 'productDetail.html' + location.search + '&id=' + id;
                } else {
                    window.location.href = 'productDetail.html?id=' + id;
                }
            });
        },
        productList: function (data) {
            var _this = productList;

            if (_this.categoryList.categoryId) {
                document.title = data.categoryName;
            } else {
                document.title = '全部商品';
            }

            for (var i = 0; i < data.dataList.length; i++) {
                if (data.dataList[i].tagsColor) {
                    data.dataList[i].tagsColor = methods.htmlDecodeByRegExp(data.dataList[i].tagsColor);
                }
                data.dataList[i].price = parseFloat(data.dataList[i].price).toFixed(2);
                data.dataList[i].marketPrice = parseFloat(data.dataList[i].marketPrice).toFixed(2);
            }
            _this.renderTpl('productListTpl', data, $('.productList'));

            if(!_this.categoryList.categoryId) {
                $('.container').dropload({
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
                    loadUpFn: function (me) {
                        _this.productList.pageNo = 1;
                        methods.request(config.productList, _this.productList, 'POST', productList);
    
                        function productList(data) {
                            _this.renderProductList(data);
                            _this.renderTpl('productListTpl', data, $('.productList'));
                            // 每次数据加载完，必须重置
                            me.resetload();
                            // 重置页数，重新获取loadDownFn的数据
                            _this.params.productList.pageNo = 1;
                            // 解锁loadDownFn里锁定的情况
                            me.unlock();
                            me.noData(false);
                        }
                    },
                    loadDownFn: function (me) {
                        _this.productList.pageNo++;
                        methods.request(config.productList, _this.productList, 'POST', productList);
    
                        function productList(data) {
                            if (data.dataList.length > 0) {
                                _this.renderProductList(data);
                            } else {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            // 插入数据到页面，放到最后面
                            _this.appendTpl('productListTpl', data, $('.productList'));
                            // 每次数据插入，必须重置
                            me.resetload();
                        }
                    },
                    threshold: 50
                });
            }
        },
        renderProductList: function(data) {
            for (var i = 0; i < data.dataList.length; i++) {
                if (data.dataList[i].tagsColor) {
                    data.dataList[i].tagsColor = methods.htmlDecodeByRegExp(data.dataList[i].tagsColor);
                }

                data.dataList[i].price = parseFloat(data.dataList[i].price).toFixed(2);
                data.dataList[i].marketPrice = parseFloat(data.dataList[i].marketPrice).toFixed(2);
            }
        }
    };
    productList.init();
});