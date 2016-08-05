

/**
 * 字符串替换过滤器
 * data 字符串
 * src 要替换的字符
 * dest 最终要换的字符
 */
exports.replace = (data, src, dest) => {
	var reg = new RegExp(src, "g");
	var tempStr = data || "";
	return tempStr.replace(reg, dest);
}


/**
 * 字符串替换过滤器
 * data 字符串
 * length 截取的字符串长度 
 */
exports.substr = (data, length, isAdd) => {
	if (data&&data.length > 0) {
		var result = data.substring(0, length);
		if (isAdd) {
			result +=  "..";
		}
		return result;
	}
	return "";
}

/**
 * 字符串添加颜色
 * data 字符串
 * strColor 要变换的颜色
 */
exports.changeColor=(data,strColor)=>{
	if(data){
		return "<span style='color:"+strColor+"'>"+data+"</span>";
	}
	return data || "";
}