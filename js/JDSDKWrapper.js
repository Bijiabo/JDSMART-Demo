// MARK: - JDSDK functions

var _DeviceIO = function() {};

_DeviceIO.prototype.getSnapshot = function(callback) {
    /*
     * 获取快照
     * callback = function(success, result) {...}
     */

    JDSMART.io.getSnapshot( //
        function (result) {
            try {
                result = JSON.parse(result);
                callback(true, result);
            } catch (error) {
                callback(false, result);
                p("parse result to JSON failed.");
            }
        },
        function (error) {
            callback(false, error);
        }
    );
};

_DeviceIO.prototype.control = function(command, callback) {
    /*
     * 控制设备接口
     * command = {
     *      "command": [{
     *          "stream_id": "switch",
     *          "current_value": "1"
     *      }]
     * }
     * callback = function(success, result) {...}
     */

    JDSMART.io.controlDevice( //
        {"command": command},
        function (result) {
            callback(true, result);
        },
        function (error) {
            callback(false, error);
        }
    );
};

_DeviceIO.prototype.initData = function(callback) {
    /*
     * 返回app初始化设备数据
     * callback = function(result) {...}
     */

    JDSMART.io.initDeviceData( function (result) {
        callback(result);
    });
};

_DeviceIO.prototype.getWifiHistory = function(startTime, endTime, count, streamIdArray) {
    /*
     * WIFI设备获取历史数据
     */

    var param = {
        "start_time": startTime, // "2015-09-01T00:00:00+0800",
        "end_time": endTime, //"2015-09-03T23:59:59+0800",
        "count": count, //20,
        "stream_id_array":streamIdArray //["temperature","channel"]
    };

    JDSMART.io.getWifiHistory(
        param,
        function (suc) {  //执行后的回调

        },
        function (error) {  //控制回调失败

        }
    );
};

var _App = function() {};

_App.prototype.networkType = function(callback) {
    /*
     * 获取APP的网络状态
     * callback = function(type) {...}
     */

    JDSMART.app.getNetworkType(function (suc) {
        callback(suc.TypeName); // 返回网络类型mobile，wifi
    });
};

_App.prototype.openUrl = function(url) {
    /*
     * 在本地新窗口中打开网页
     * 注意：只可打开普通展示类页面，不支持控制、快照等功能！
     */

    JDSMART.app.openUrl(
        url // 网页url
    );
};

_App.prototype.config = function(showBack, showShare, showMore, color) {
    /*
     * 配置导航按钮
     * 注：由于新版微联app v2.2加入原生在线状态提示，因此建议开发者可以在调用快照接口后，根据在线状态来控制显示隐藏在线提示。
     */

    JDSMART.app.config({
        showBack: showBack || false, // 返回按钮，false是隐藏，true是显示
        showShare: showShare || false,
        showMore: showMore || false, // 更多按钮
        color: color || "#998877"   // title栏颜色  true-不在线，false-在线
    });
};

_App.prototype.alert = function(title, yesButtonTitle, noButtonTitle, callback) {
    /*
     * app的统一对话框提示
     * callback = function(yes: Bool) {...}
     */

    if (callback == undefined) {
        callback = function() {
            p("_App.prototype.alert warning: callback function is undefinded.");
        };
    }

    JDSMART.app.alert({
            messageTitle: title || "提示",
            messageYes: yesButtonTitle || "确定",
            messageNo: noButtonTitle || "取消"
        },
        function (res) {
            if (res == 1) {
                callback(true);
            } else {
                callback(false);
            }
        });
};

_App.prototype.toast = function(message) {
    /*
     * app统一吐司提示
     */

    JDSMART.app.toast ({
        message: message
    });
};

_App.prototype.loading = function(isLoading) {
    /*
     * app的加载效果
     * isLoading == true为开始加载
     * isLoading == false为关闭加载
     */

    JDSMART.app.loading (isLoading);
};

var Post = function(url, param, callback) {
    /*
     * 发送post请求
     */

    JDSMART.util.post(
        url,
        param,
        callback(res)
    );
};

var App = new _App();
var Device = new _DeviceIO();

function onReceive(data){
    p(data);
}