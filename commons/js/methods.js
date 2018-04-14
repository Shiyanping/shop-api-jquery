/**
 * Created by syp on 2017/2/9.
 * 公共的方法
 */

var methods = {
    /**
     * 时间格式化
     * 用法：dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
     */
    dateFormat: function (date, format) {
        if (format === undefined) {
            format = date;
            date = new Date();
        }
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            }
            else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    },
    /**
     * 获取url参数
     */
    getUrlParam: function (url, param) {
        var r = new RegExp("\\?(?:.+&)?" + param + "=(.*?)(?:[\?&].*)?$");
        var m = url.match(r);
        return m ? m[1] : "";
    },
    //设置cookie
    setCookie: function (name, value, seconds) {
        seconds = seconds || 0;   //seconds有值就直接赋值，没有为0，这个跟php不一样。
        var expires = "";
        if (seconds != 0) {      //设置cookie生存时间
            var date = new Date();
            date.setTime(date.getTime() + (seconds * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + escape(value) + expires + "; path=/";   //转码并赋值
    },
    //取得cookie
    getCookie: function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');    //把cookie分割成组
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];                      //取得字符串
            while (c.charAt(0) == ' ') {          //判断一下字符串有没有前导空格
                c = c.substring(1, c.length);      //有的话，从第二位开始取
            }
            if (c.indexOf(nameEQ) == 0) {       //如果含有我们要的name
                return unescape(c.substring(nameEQ.length, c.length));    //解码并截取我们要值
            }
        }
        return false;
    },
    //清除cookie
    clearCookie: function (name) {
        this.setCookie(name, "", -1);
    },
    //ajax封装
    request: function(url, data, type, callback, errorCallBack) {
        $.ajax({
            url: url,
            data: data,
            type: type,
            dataType : "json",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            success: function (data) {
                callback && callback(data);
            },
            error: function (error) {
                errorCallBack && errorCallBack(error);
            }
        })
    },
    // 生成随机数
    randomString: function (len) {
        len = len || 6;
        var $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },
    //生成uuid随机数
    uuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },
    //原生ajax
    ajax: function (option) {
        var options = option || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = methods.formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            if(options.url.indexOf('?') != -1) {
                xhr.open("GET", options.url, true);
            }else {
                xhr.open("GET", options.url + "?" + params, true);
            }
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            xhr.send(params);
        }
    },
    formatParams: function (data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        // arr.push(("v=" + Math.random()).replace(".",""));
        return arr.join("&");
    },
    nativeAjax: function (url, data, type, success, failed) {
        methods.ajax({
            url: url,              //请求地址
            type: type,                       //请求方式
            data: data,        //请求参数
            dataType: "json",
            success: function (response, xml) {
                if(typeof response === 'string') {
                    response = JSON.parse(response);
                }
                success && success(response)
            },
            fail: function (status) {
                failed && failed(status)
            }
        });
    },
    /*
     html  deCode函数
     */
    htmlDecodeByRegExp: function (str) {
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&gt;/g, "&");
        s = s.replace(/& lt;/g, "<");
        s = s.replace(/& gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/& #39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br>/g, "\n");
        s = s.replace(/& #40;/g, "\(");
        s = s.replace(/& #41;/g, "\)");
        return s;
    },
    /*
    去除字符串中的空格
     */
    trim: function (str, is_global) {
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g, "");
        if (is_global.toLowerCase() == "g") {
            result = result.replace(/\s/g, "");
        }
        return result;
    },
    /*  字符串保留后四位*/
    subStr: function (str) {
        str = str + ''
        var newStr = str.slice(str.length - 5, str.length - 1);
        var Str = '***' + newStr;
        return Str
    }
};
