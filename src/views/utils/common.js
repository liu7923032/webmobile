const common = {
	//1:处理结果返回的结果
	procResult(data, success, error) {
		if (data.ok == "ok") {
			var jsonData = data.data;
			if (jsonData.Statu == "Y") {
				if (typeof (success) == "function") {
					success(data.data);
				}
			}
		}
		else if (data.status == "401") {
			//身份验证失败
		}
		else {
			//返回结果失败
			if (typeof (fail) == "function") {
				fail(data.data);
			}
		}
	},
	getUrlParam(paramName) {
		let url = location.href;
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {}

		for (let i = 0; i < paraString.length; i++) {
			let j = paraString[i];
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paramName.toLowerCase()];

		if (typeof (returnValue) == "undefined") {
			return "";
		} else {
			if (returnValue.indexOf('#') >= 0) {
				returnValue = returnValue.substring(0, returnValue.length - 1);
			}
			return returnValue;
		}
	},
	// 检查是否字段是否都有填写
	checkPostData(postData) {
		return Object.keys(postData).some(u => {
			return postData[u] == "";
		});
	},
	// 情况vue的实例
	clearVm(data) {
		Object.keys(data).some(u => {
			var strType = typeof (data[u]);
			switch (strType) {
				case "string":
					data[u] == "";
					break;
				case "object":
					// 1:检查是否是数组类型
					// if (data[u] instanceof Array) {
					// 	data[u] = [];
					// } else {
					// 	data[u] = undefined;
					// }
					break;
				case "number":
					data[u] = 0;
					break;
			}
		});
	},
	setWXCfg(appId, timestamp, nonceStr, signature) {
		var wxObj = {
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: appId, // 必填，企业号的唯一标识，此处填写企业号corpid
			timestamp: timestamp, // 必填，生成签名的时间戳
			nonceStr: nonceStr, // 必填，生成签名的随机串
			signature: signature,// 必填，签名，见附录1
			jsApiList: ["getNetworkType", "chooseImage", "previewImage", "uploadImage", "scanQRCode","getLocation"]
		};
		if (localStorage) {
			localStorage.setItem('wxcfg', JSON.stringify(wxObj));
		}
	},
	getWXCfg() {
		if (localStorage) {
			var strCfg = localStorage.getItem("wxcfg");
			return JSON.parse(strCfg);
		}
		return false;
	},
	//设置微信
	initWX() {
		if (!wx) {
			return false;
		}
		//设置微信的config
		var wxCfg = common.getWXCfg();
		if (!wxCfg) {
			return false;
		}
		wx.config(wxCfg);
	},
	isCanWeiXin() {
		return wx && wx.config.appId;
	}

}

export default common

