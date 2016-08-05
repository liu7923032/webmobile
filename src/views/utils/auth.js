const auth={
	// 设置人员
	setUser(account,ticket,isAway){
		var user={
			account:account,
			ticket:ticket,
			isAway:isAway
		}
		if(isAway){
			localStorage.setItem("user",JSON.stringify(user));
		}else{
			sessionStorage.setItem("user",JSON.stringify(user));
		}
	},
	getTicket(){
		var user=auth.getUser();
		if(user){
			return user.ticket;
		}else{
			return "";
		}
	},
	//检查该对象是否存在
	isLogin(){
		var temp=auth.getUser();
		if(temp){
			return true;
		}else{
			return false;
		}
	},
	//获取用户
	getUser () {
		var userStr= localStorage.getItem("user")||sessionStorage.getItem("user");
		if(userStr){
			return JSON.parse(userStr);
		}else{
			return false;
		}

	}
}

export default auth