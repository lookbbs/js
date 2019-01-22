/**
 * 表单提交页面的公共js
 * 适配layui框架的form表单
 (function (window) {
    const pageConfig = {
        form: {
            url: '',
            on: [],
            buildData: function (data) {
            },
            ajaxSuccess: function (result) {
            }
        }
    };
    if (ydf.adapter.layui.init) {
        ydf.adapter.layui.init(pageConfig);
    }
})(window)
 *  form: {
 *     url：         必填项。字符串，提交表单数据保存的post申请url
 *     upload：      选填项。数组对象，表单内上传组件的配置。参考：src/main/resources/plugin/js/extension/pack/packTaskEdit.js
 *     verify：      选填项。对象。表单验证
 *     on：          选填项。数组对象，表单内各输入框注册的事件
 *     buildData：   选填项。function，提交表单前，提交的数据处理函数
 *     ajaxSuccess： 必填项。function，异步post请求数据成功后处理函数
 * }
 */
(function (win) {
    let ydf = win.ydf || {};
    ydf = $.extend({
        adapter: {
            layui: {}
        }
    }, ydf);
    win.ydf = ydf;

    //页面初始化
    ydf.adapter.layui.init = function (pageConfig) {

        layui.use(['form', 'laydate', 'upload'], function () {
            let form = layui.form,
                upload = layui.upload;
            if (pageConfig.form) {
                let on = pageConfig.form.on || [];
                ydf.forEach(on,function (item) {
                    form.on(item.event, item.callback);
                })

                // 文件上传
                const uploadArray = pageConfig.form.upload;

                ydf.forEach(uploadArray, function (item) {
                    upload.render(item);
                })
                const verify = $.extend({
                    required: function (value) {
                        if (ydf.stringUtil.isEmpty(value)) {
                            return '内容不可为空';
                        }
                    },
                    // value：表单的值、obj：表单的DOM对象
                    range: function (value, obj) {
                        if (!ydf.util.isNumber(value)) {
                            return "请正确输入数字";
                        }
                        value = parseInt(value);
                        let max = obj.getAttribute("max");
                        let mini = obj.getAttribute("mini");
                        if (max) {
                            if (!ydf.util.isNumber(max)) {
                                max = $("#" + max).val();
                            }
                            max = parseInt(max);
                            if (value > max) {
                                return "输入值超过最大值：" + max;
                            }
                        }
                        if (mini) {
                            if (!ydf.util.isNumber(mini)) {
                                mini = $("#" + mini).val();
                            }
                            mini = parseInt(mini);
                            if (value < mini) {
                                return "输入值超过最小值：" + mini;
                            }
                        }
                    },
                    number: [/\d+/, '请输入正确数字']
                }, pageConfig.form.verify);
                // 表单验证
                form.verify(verify);
            }

            $("input[lay-date]").each(function () {
                const _this = this;
                const conf = $.extend({
                    elem: '#' + _this.id,
                    theme: 'molv',
                    type: 'datetime',
                    isInitValue: !!_this.value
                }, eval('(' + ($(this).attr("lay-date") || '{}') + ')'));
                const format = conf["format"];
                if (format) {
                    if (/^y+[-/]M+[-/]d+$/.test(format)) {
                        // 只做格式为：yyyy-MM-dd的检查，其它格式暂无需求
                        conf["type"] = "date";
                    }
                }
                if (_this.value) {
                    conf["value"] = _this.value;
                }
                layui.laydate.render(conf);
            });

            // 搜索按钮监听
            form.on('submit(save)', function (data) {
                if (pageConfig.form.hasOwnProperty("checkSubmit") && typeof(eval("pageConfig.form.checkSubmit")) === "function") {
                    if (!eval("pageConfig.form.checkSubmit()")) {
                        console.log("编辑页配置了函数：pageConfig.form.checkSubmit ，并且返回值为false，系统停止提交表单");
                        return false;
                    }
                }
                if (pageConfig.form.hasOwnProperty("buildData")) {
                    data.field = pageConfig.form.buildData(data.field);
                }
                const field = data.field;
                const url = pageConfig.form.url;
                ydf.ajax.post(url, field, pageConfig.form.ajaxSuccess);
                return false;
            });

            $('#close').click(function () {
                const index = parent.layer.getFrameIndex(win.name);
                parent.layer.close(index);
            });

            // 渲染表单
            form.render();
        });
    }
})(window);