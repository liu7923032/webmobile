<template>
	<div class="page logDetail">
		<x-header :left-options="{showBack:true,backText:'返回'}">
			<p>{{curDay}}</p>
		</x-header>
		<div class="weui-tab-bd">
			<group title="时间">
				<datetime :value.sync="sTime" format="YYYY-MM-DD HH:mm" title="开始时间" confirm-text="完成" cancel-text="取消"></datetime>
				<datetime :value.sync="eTime" format="YYYY-MM-DD HH:mm" title="结束时间" confirm-text="完成" cancel-text="取消"></datetime>
			</group>
			<group title="内容信息">
				<popup-picker title="工作类型"  :data="typeOptions" :value.sync="wType" show-name></popup-picker>
				<cell title="选择项目" v-show="showPro" is-link @click="showPop">
					<span slot="value">{{ projectName | substr 10 true }}</span>
				</cell>
				<x-input :min="3" :max="20" :value.sync="subTitle" is-type="china_name" placeholder="日志标题:长度3~20"></x-input>
				<x-textarea :max="200" :row="8" :height="200" :value.sync="remark" placeholder="请填写日志内容"></x-textarea>
				<box gap="10px 10px">
					<x-button @click="saveLog" type="primary">
						提交
					</x-button>
				</box>
			</group>
		</div>


		<popup :show.sync="popshow" height="90%">
			<div class="popbd">
				<group title="我主导的项目">
					<cell v-for="item in mainData" :title="item.text" @click="choosePro(item)">
					</cell>
				</group>
				<!-- </scroller> -->
				<group title="我参与的项目">
					<!-- <scroller lock-x> -->
					<cell v-for="item in partData" :title="item.text" @click="choosePro(item)">
					</cell>
				</group>
			</div>
		</popup>
	</div>
</template>


<script lang="babel">

 import PopupPicker from 'vux-components/popup-picker'
 import XInput from 'vux-components/x-input'
 import XHeader from 'vux-components/x-header'
 import XTextarea from 'vux-components/x-textarea'
 import XButton from 'vux-components/x-button'
 import Scroller from 'vux-components/scroller'
 import Popup from 'vux-components/popup'
 import Datetime from 'vux-components/datetime'
 import Group from 'vux-components/group'
 import Cell from 'vux-components/cell'
 import Card from 'vux-components/card'
 import Box from 'vux-components/box'
 import Search from 'vux-components/search'
 

//   import { PopupPicker, Group,XInput,Datetime,XTextarea,XButton,Box,XHeader,Cell,Popup,Search,Scroller } from 'vux-components'
  import common from '../utils/common'
	export default {
		name:'logdetail',
		data(){
			return {
				curDay:'',
				type:'',
				typeOptions:[
								{value:'XMGZLB',name:"项目工作"},
								{value:'RCGZLB',name:"日常工作"},
								{value:'SHGZLB',name:"售后工作"}
						  	],
				mainData:[],
				partData:[],
				wType:['XMGZLB'],
				remark:'',
				projectCode:'',
				projectName:'',
				sTime:'',
				eTime:'',
				popshow:false
			}
		},
		route:{
			//加载数
			data(transition){
			  this.clearForm();
			  var date=new Date();
				//加载数据
			  this.curDay=transition.to.params.date;
			  this.type=transition.to.query.type=="add"||'edit';
			  this.sTime=this.curDay+' 08:50';
			  this.eTime=this.curDay+' 17:50';

			}
		},
		watch:{
			wType:function (value) {
				if(value!="XMGZLB"){
					this.project={"id":'',"text":''};
				}
    		}
		},
		computed:{
			subTitle () {
				//通过选择的值找到
				var workType=this.wType[0];
				var wName="";
				this.typeOptions.forEach((item)=>{
					if(item.value==workType){
						wName=item.name;
					}
				});
				return '['+this.curDay+']'+wName;
			},
			showPro () {
				return this.wType[0]=="XMGZLB";
			}
		},
		components:{
			PopupPicker,
			Group,
			XInput,
			Datetime,
			XTextarea,
			XButton,
			Box,
			XHeader,
			Cell,
			Popup,
			Search,
			Scroller
		},
	
		methods:{
			choosePro (item) {
				this.popshow=false;
				this.projectCode=item.id;
				this.projectName=item.text;
			},
			//查询
			showPop () {
				//加载项目信息
				if(this.mainData.length==0){
					//加载数据
					this.$http.get("Project").then((success)=>{
							var jsonData=success.data;
							if(jsonData.length==0){
								return false;
							}
							this.mainData =	jsonData.filter((item)=>{
								return item.desc=="main";
							});
							this.partData =	jsonData.filter((item)=>{
								return item.desc=="part";
							});
						this.popshow=true;
					})
				}else{
						this.popshow=true;
				}
			},
			clearForm(){
			  	this.remark='';
			  	this.projectCode="";
				this.projectName="";
			},
			loadMore (index) {
				var index=type==0?this.mainIndex:this.partIndex;
				this.$http.get('Project',{type:type,pageIndex:index}).then((response)=>{
					if(type==0){
						this.mainData=response.data;
					}else{
						this.partData=response.data;
					}

				},(error)=>{

				})
			},
			saveLog(){
				//1:提交表单内容
				var postData={
					SubTitle:this.subTitle,
					StartTime:this.sTime,
					EndTime:this.eTime,
					WorkType:this.wType[0],
					Remark:this.remark
				};

				//检查如果日志类别的话,提示请选择项目名称
			   var isFalse=	common.checkPostData(postData);
			   if(isFalse){
				   this.$root.toast={show:true,text:'请填写必填项',type:'cancel'};
				   return false;
			   }
			   postData["ProjectCode"]="";
				//1:检查是否包含项目工作
				if(postData.WorkType=="XMGZLB"){
					var proCode=this.projectCode;
					if(proCode.length==0){
						 this.$root.toast={show:true,text:'请选择项目工作',type:'cancel'};
				  		 return false;
					}
					postData["ProjectCode"]=proCode;
				}


				this.$http.post("WorkLog",JSON.stringify(postData)).then((success)=>{
					//提示保存成功
					this.$root.toast={type:'ok',text:success.data.Msg,show:true};
					//清空表单信息
					this.clearForm();
					//设置
					history.back();
				},(error)=>{

				});
			}
		}
	}
</script>

<style type="text/css">
	.weui_label {
		width: 4em;
	}
	
	.logDetail .page-bd {
		padding-bottom: 30px;
		overflow: auto;
	}

	.popbd{
		height:100%;
		overflow-y:auto;
	}
</style>