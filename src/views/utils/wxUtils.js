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

    }
}


export default wxUtils