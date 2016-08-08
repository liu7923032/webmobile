const wxUtils = {
    // 1：选择图片并上传
    chooseImg(wx, success) {
        // 1.1 选择图片
        wx.chooseImage({
            success: function (res) {
                // 2：图片选择成功后,上传到微信服务器
                // 3:上传到服务器
                wxUtils.uploadImg(wx, res.localIds[0], success);
            },
            fail: function (res) {
                alert(JSON.stringify(res));
            }
        });
    },
    // 2.0 上传文件到服务器
    uploadImg(wx, localId, success) {
        wx.uploadImage({
            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProcess: 1,   // 默认为1，显示进度提示
            success: function (res) {
                //如果上传成功,那么就执行
                if (typeof (success) == "function") {
                    success(localId, res.serverId);
                }
            },
            fail: function (res) {
                alert('上传失败');
            }
        });
    },
    // 3.0 上传文档成功后,预览服务器图片
    prevImg() {

    },
    getLocation(success) {
        wx.getLocation({
            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度
                if (typeof (success) == "function") {
                    success(latitude, longitude);
                }
                //记录当前的位置信息
                if (localStorage) {
                    localStorage.setItem("location", JSON.stringify({ lat: latitude, long: longitude }));
                }
            }
        });
    }
}


export default wxUtils