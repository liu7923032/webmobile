const wxUtils = {
    setWXCfg(appId, timestamp, nonceStr, signature) {
        var wxObj = {
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: appId, // 必填，企业号的唯一标识，此处填写企业号corpid
			timestamp: timestamp, // 必填，生成签名的时间戳
			nonceStr: nonceStr, // 必填，生成签名的随机串
			signature: signature,// 必填，签名，见附录1
			jsApiList: ["getNetworkType", "chooseImage", "previewImage", "uploadImage", "scanQRCode","getLocation","checkJsApi","openLocation"]
		};
		if (localStorage) {
			localStorage.setItem('wxcfg', JSON.stringify(wxObj));
		}
        wx.config(wxObj);
    },
    checkJsApi(apiName, success) {
        console.log("检查微信版本是否支持该API:"+apiName);
        wx.checkJsApi({
            jsApiList: [
                apiName
            ],
            success: function (res) {
                if (res.checkResult[apiName] == false) {
                    alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
                    return;
                }
                if (typeof (success) == "function") {
                    console.log(" 成功进入调用getLocation api的接口")
                    success();
                }
            }
        });
    },
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
    // 3.0 获取人员的位置信息
    getLocation(success) {
        wxUtils.checkJsApi("getLocation", function () {
            wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    var speed = res.speed; // 速度，以米/每秒计
                    var accuracy = res.accuracy; // 位置精度
                    console.log("维度:" + latitude + "-精度:" + longitude);
                    if (typeof (success) == "function") {
                        console.log("执行");
                        success(latitude, longitude);
                    }
                    //记录当前的位置信息
                    if (localStorage) {
                        localStorage.setItem("location", JSON.stringify({ lat: latitude, long: longitude }));
                    }
                },
                fail:function(){
                    alert("调用失败");
                }
            });
        });
    }
}


export default wxUtils