/**
 * CMS系统的公共js类
 * @date 2018/11/19
 * @author dongfei.yuan
 */
(function (win) {
    var ydf = win.ydf || {};
    win.ydf = ydf;

    /**
     * 参考：https://www.cnblogs.com/mr-wuxiansheng/p/6296646.html
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    ydf.dialog = {
        /**
         * 打开一个弹出层
         * @param param
         */
        open: function (param) {
            param = $.extend({
                title: "",
                url: "",
                width: "900",   // 默认：1100px
                height: "450"   // 默认450px
            }, param);
            return layer.open({
                id: 'dialog',
                type: 2,
                area: [param.width + 'px', param.height + 'px'],
                fix: false,
                maxmin: true,
                shadeClose: false,
                shade: 0.4,
                title: param.title,
                content: param.url
            });
        },
        /**
         * 打开确认窗口
         * @param message 消息提示
         * @param btn 按钮列表
         * @param yes 点击yes[确定]按钮后的回调函数
         */
        confirm: function (message, btn, yes) {
            var args = arguments;
            if (args.length == 2 && typeof(btn) == 'function') {
                yes = btn;
            }
            btn = $.extend({btn: ['确定', '取消']}, btn);
            return layer.confirm(message, btn, function (index) {
                layer.close(index);
                yes();
            });
        },
        /**
         * 消息提示
         * @param message
         */
        alert: function (message, yes) {
            return layer.open({
                title: '系统提示',
                content: message,
                yes: function (index, layero) {
                    layer.close(index);
                    yes();
                }
            });
        },
        /**
         * 无框消息提示
         * @param message
         * @param closed 关闭后事件
         */
        msg: function (message, closed) {
            return layer.msg(message, closed);
        },

        tips: function (message, obj, param) {
            $.extend({tips: [2, '#09aa14']}, param);
            return layer.tips(message, obj, param);
        },

        load: function () {
            return layer.load(0, {
                shade: [0.5, '#c2c2c2']
            });
        },

        full: function (index) {
            layer.full(index);
        },
        /**
         * 关闭弹出层
         * @param obj
         */
        close: function (obj) {
            if (obj) {
                layer.close(obj);
            } else {
                console.error("obj is not dialog object", obj);
            }
        }
    };

    /**
     * 异步请求对象
     * @type {{get: ydf.ajax.get, post: ydf.ajax.post, put: ydf.ajax.put, delete: ydf.ajax.delete, ajax: ydf.ajax.ajax}}
     */
    ydf.ajax = {
        get: function (url, data, success) {
            ydf.ajax.ajax({
                url: url,
                type: "GET",
                data: data,
                success: success
            });
        },
        post: function (url, data, success) {
            ydf.ajax.ajax({
                url: url,
                type: "POST",
                data: data,
                success: success
            });
        },
        put: function (url, data, success) {
            ydf.ajax.ajax({
                url: url,
                type: "PUT",
                data: data,
                success: success
            });
        },
        delete: function (url, data, success) {
            ydf.ajax.ajax({
                url: url,
                type: "DELETE",
                data: data,
                success: success
            });
        },
        ajax: function (param) {
            if (ydf.stringUtil.isEmpty(param.url)) {
                ydf.dialog.alert("param.url不可为空");
                return false;
            }
            if (ydf.stringUtil.isEmpty(param.type)) {
                ydf.dialog.alert("param.type不可为空");
                return false;
            }
            $.ajax({
                url: param.url,
                type: param.type,
                data: param.data,
                success: function (result) {
                    param.success(result);
                    console.log(result);
                },
                error: function (error) {
                    if (param.hasOwnProperty(error)) {
                        param.error(error);
                    }
                    console.error(error);
                    window.top.layer.msg('请求超时，稍后再试');
                }
            });
        }
    };

    /**
     * 字符串工具类
     * @type {{isEmpty: ydf.stringUtil.isEmpty, trim: (function(*): *)}}
     */
    ydf.stringUtil = {
        /**
         * 判断字符串是否为空
         * @param str
         * @returns true：空，false：非空
         */
        isEmpty: function (str) {
            if (!str) {
                return true;
            }
            str = ydf.stringUtil.trim(str);
            return str.length == 0;
        },
        /**
         * 去除左右两头的空格
         * @param str
         * @returns {*}
         */
        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        },
        /**
         * 数字左补零0
         * @param number 数字
         * @param length 需要显示的长度
         * @returns {string}处理后的字符串
         */
        prefixZero: function (number, length) {
            return (Array(length).join(0) + number).slice(-length);
        }
    };

    ydf.util = {

        /**
         * 日期格式化
         * @param time new Date()构造参数
         * @param format 输出格式
         * @returns {*}
         */
        dateFormat: function (time, format) {
            if (!time) {
                return "";
            }
            if (!format) {
                format = "yyyy-MM-dd HH:mm:ss";
            }
            return new Date(time).format(format);
        },
        /**
         * 判断是否是数字
         * @param val
         * @returns {*|boolean}
         */
        isNumber: function (val) {
            return /\d+/.test(val);
        }
    }

    ydf.forEach = function (obj, forEachCallback) {
        obj && Array.isArray(obj) && obj.forEach(item => {
            forEachCallback(item);
        })
    }
})(window);