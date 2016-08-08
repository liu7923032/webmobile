<template>
	<div class="page login">
		<x-header :left-options="{showBack: false}">
			<p>登陆页</p>
		</x-header>
		<div class="page-bd">
			<div class="loginUrl">
				<img src="../assets/images/login/login.png" alt="用户">
			</div>
			<group>
				<x-input title="账号:" placeholder="长度是5位的工号" :min="5" :max="5" :value.sync="account"></x-input>
				<x-input title="密码:" placeholder="最短要4位" type="password" :min="4" :max="15" :value.sync="pwd"></x-input>
			</group>
			<group>
				<switch title="是否记忆密码" :value="isremeber"></switch>
			</group>
			<box gap="10px 10px">
				<x-button @click="login" type="primary">登录</x-button>
			</box>
		</div>

	</div>
</template>


<script>

	import XHeader from 'vux-components/x-header'
	import Dialog from 'vux-components/dialog'
	import Switch from 'vux-components/switch'
	import XInput from 'vux-components/x-input'
	import XButton from 'vux-components/x-button'
	import Group from 'vux-components/group'
	import Cell from 'vux-components/cell'
	import Box from 'vux-components/box'
	import auth from './utils/auth.js'
	// import {Box,XButton,Group,XInput,XHeader,Switch,Dialog,Cell} from 'vux-components'
	export default {
		data(){
			return {
				account:'',
				pwd:'',
				isremeber:true,
				errMsg:'错误了',
				device:'',
				redirectUrl:'',
				show:false
			}
		},
		route:{
			data (transtion) {

			}
		},
		ready(){
			// this.account="M";
			// console.log(this.$refs.account)
			// this.$els.account.focus();
			var tmpDevice=""
			if(this.getVersion().ios){
				this.device="ios";
			}else if(this.getVersion().android){
				this.device= "android";
			}else if(this.getVersion().iPhone){
				this.device= "iPhone";
			}else if(this.getVersion().iPad){
				this.device="iPad";
			}else{
				this.device="web";
			}
			//得到重定向的url
			 this.redirectUrl= decodeURIComponent(this.$route.query.redirect || '/');
		},
		components:{
			XHeader,
			XButton,
			Cell,
			Group,
			XInput,
			Switch,
			Box,
			Dialog
		},
		methods:{
			login () {
				//向服务器发起请登录请求
				if(this.account.length!=5){
					// this.errorMsg="账号必须是五位";
					// this.isPrompt=true;
					this.$root.dialog={show:true,text:'长度要5位'};
					return false;
				}
				
				if(this.pwd.length<3){
					// this.errorMsg="密码最小长度是三位:"+this.getVersion().android;
					this.$root.dialog={show:true,text:'密码长度最短要3位'};
					return;
				}

				//向服务器发起请求
				this.$http.get("auth",{"account":this.account,"passwd":this.pwd,"device":this.device}).then((response)=>{
					var data=response.data;
					if(data.Statu=="Y"){
						//保存用户信息到数据库中
						auth.setUser(this.account,data.Data,this.isremeber);
						//跳转到首页
						this.$router.go("/mobile");
						// console.log("我的测试:"+this.$route);
						// if(this.redirectUrl&&this.redirectUrl.length>0){
						// 	this.$route.router.go(this.redirectUrl);
						// }
						// else{
						// 	this.$route.router.go("index");
						// }
					}else{
						this.$root.dialog={show:true,text:data.Msg};
					}
					
				});
			},
			getVersion(){
           		let u = navigator.userAgent,
                app = navigator.appVersion;
	            return { //移动终端浏览器版本信息
	                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
	                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
	                iPad: u.indexOf('iPad') > -1, //是否iPad
	            };
			}
		}
	}
</script>


<style scoped lang="less">
	.login {
		.loginUrl {
			text-align: center;
			margin: 30px 5px;
		}
		p {
			font-size: 13px;
		}
	}
</style>