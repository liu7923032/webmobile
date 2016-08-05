<template>
	<div class="page proinfo">
		<x-header :left-options="{showBack:true,backText:'返回'}">
			<p>项目信息</p>
		</x-header>
		<tab>
			<tab-item :selected="selectIndex === 0" @click="selectIndex = 0">
				基本信息
			</tab-item>
			<tab-item :selected="selectIndex === 1" @click="selectIndex = 1">
				文档上传
			</tab-item>
			<tab-item :selected="selectIndex === 2" @click="selectIndex = 2">
				文档列表
			</tab-item>
		</tab>
		<swiper :index.sync="selectIndex" :dots-class="custom" height="521px" :show-dots="false">
			<swiper-item>
				<scroller lock-x scrollbar-y :prevent-default="false">
					<div style="padding-bottom:120px;">
						<group :title="ProjectName">
							<cell title="医院名称">
								<div slot="value">
									<span style="color: green">{{HospName}}</span>
								</div>
							</cell>
							<cell title="产品线">
								<div slot="value">
									<span style="color: green">{{LineName}}</span>
								</div>
							</cell>
							<cell title="项目经理">
								<div slot="value">
									<span style="color: green">{{UserName}}</span>
								</div>
							</cell>
							<cell title="项目金额">
								<div slot="value">
									<span style="color: green">{{ProjectMoney}}</span>
								</div>
							</cell>
							<cell title="项目类型">
								<div slot="value">
									<span style="color: green">{{TypeName}}</span>
								</div>
							</cell>
							<cell title="项目属性">
								<div slot="value">
									<span style="color: green">{{AttrName}}</span>
								</div>
							</cell>
							<cell title="项目状态">
								<div slot="value">
									<span style="color: green">{{StatusName}}</span>
								</div>
							</cell>
							<cell title="项目阶段">
								<div slot="value">
									<span style="color: green">{{StageName}}</span>
								</div>
							</cell>
							<cell title="安装数量">
								<div slot="value">
									<span style="color: green">{{InstallUnit}}</span>
								</div>
							</cell>
							<cell title="入场时间">
								<div slot="value">
									<span style="color: green">{{EnterDate | substr 10}}</span>
								</div>
							</cell>
							<cell title="验收时间">
								<div slot="value">
									<span style="color: green">{{DocDate | substr 10}}</span>
								</div>
							</cell>
						</group>
					</div>
				</scroller>
			</swiper-item>
			<swiper-item>
				<scroller lock-x scrollbar-y :prevent-default="false">
					<div style="padding-bottom:120px;">
						<group title="上传文档">
							<popup-picker title="文档类型" :data="docTypeList" :value.sync="docType"></popup-picker>
							<datetime :value.sync="docDate" format="YYYY-MM-DD" title="签字日期" confirm-text="完成" cancel-text="取消"></datetime>
							<cell>
								<uploader slot="after-title" :count="fileCount" :maxlength="1" @select-file="chooseImg">
									<span slot="title">文件上传</span>
									<uploader-files slot="uploader-files" v-show="showfile" :image-url="imgPath">
									</uploader-files>
								</uploader>
							</cell>
							<x-textarea :max="200" :row="6" :height="150" :value.sync="memo" placeholder="文档备注信息"></x-textarea>
							<box gap="10px 10px">
								<x-button @click="saveProDoc" type="primary">
									上传文档
								</x-button>
							</box>
						</group>
					</div>

				</scroller>
			</swiper-item>
			<swiper-item>
				<scroller lock-x scrollbar-y :prevent-default="false">
					<div style="padding-bottom:120px;">
						<group title="已上传文档">
							<cell v-for="item in docList" :title="item.DictName" track-by="$index" :value="item.DocDate | substr 10">
								<div slot="after-title" class="app_ok" v-if="item.ApproveStatus == 'Y'">已审</div>
								<div slot="after-title" class="app_cancel" v-if="item.ApproveStatus == 'N'">被拒</div>
								<div slot="after-title" class="app_wait" v-if="!item.ApproveStatus">待审</div>
							</cell>
						</group>
					</div>
				</scroller>
			</swiper-item>
		</swiper>
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
 import Swiper from 'vux-components/swiper'
 import SwiperItem from 'vux-components/swiper-item'
 
 import {Tab,TabItem} from 'vux-components/tab'

// import	{ XHeader,Group,Cell,Tab, TabItem ,Scroller,PopupPicker,Datetime,XInput,XTextarea,Box,XButton} from 'vux-components'
import 	{ Uploader, UploaderFiles, UploaderFile } from '../../components';
import common from '../utils/common';
import wxutils from '../utils/wxUtils'
	export default {
		name:'proinfo',
		data () {
			return {
				ProjectCode:'',
				ProjectName:'',
				InstallUnit:0,
				EnterDate:'',
				HospDept:0,
				HospName:'',
				ProjectMoney:0,
				IncomeMoney:'',
				LineName:0,
				StageName:'',
				StageNo:0,
				StatusName:'',
				TypeName:0,
				AcceptDate:'',
				UserName:0,
				AttrName:'',
				selectIndex:0,
				docTypeList:[["无"]],
				docType:["无"],
				docList:[],
				docDate:'',
				memo:'',
				// 文件上传涉及的变量
				showfile:false,
				imgPath:'',
				fileCount:0,
				serverId:''
			}
		},
		route:{
			data(transition){
				this.ProjectCode=transition.to.params.id;
				
				//加载基本信息
				this.loadInfo();
				//重新进入后初始化数据

			}
		},
		components:{
			XHeader,
			Group,
			Cell,
			Tab,
			TabItem,
			Scroller,
			PopupPicker,
			Datetime,
			XInput,
			XTextarea,
			Uploader, UploaderFiles, UploaderFile,
			Box,XButton,
			Swiper,SwiperItem
		},
		ready () {
			common.initWX();
		},
		methods:{
			// 加载项目的基本信息
			loadInfo () {
				var url="Project/"+this.ProjectCode;
				var docUrl="SysDict/项目文档";
					//调用远程,加载该项目的基本信息i
				this.$http.get(url).then((success)=>{
					// console.log(success.data);
					var project=success.data;
					if(!project){
						return false;
					}
					console.log(project);
					this.ProjectName=project.ProjectName;
					this.InstallUnit=project.InstallUnit;
					this.EnterDate=project.EnterDate;
					this.HospDept=project.HospDept;
					this.HospName=project.HospName;
					this.ProjectMoney=project.ProjectMoney;
					this.IncomeMoney=project.IncomeMoney;
					this.LineName=project.LineName;
					this.StageNo=project.StageNo;
					this.StageName=project.StageName;
					this.StatusName=project.StatusName;
					this.TypeName=project.TypeName;
					this.AcceptDate=project.DocDate;
					this.UserName=project.UserName;
					this.AttrName=project.AttrName;
					
					
					 //加载已经上传的文档
					 if(this.docList.length==0){
						this.loadDocList();
					 }
					 if(this.docTypeList[0].length==1){
						//加载文档信息
						this.loadDocs();
					 }
				},(error)=>{

				});
			},
			// 加载项目文档信息
			loadDocs () {
				var url="SysDict/项目文档";
				var _this=this;
					//调用远程,加载该项目的基本信息i
				_this.$http.get(url).then((success)=>{
					var doclist=success.data;
					if(doclist.length==0){
						return false;
					}

				  	var tempList = doclist.filter((item)=>{
						if(item.DictParam.length>10){
							var curStageCode=JSON.parse(item.DictParam).StageCode;
							return curStageCode==_this.StageNo
						}else{
							return false;
						}
					}).map((item)=>{
						return item.DictName;
					});
					tempList.forEach(u=>{
						_this.docTypeList[0].push(u);
					})
					// _this.docTypeList=[tempList];
				});
			},
			loadDocList () {
				this.$http.get("Document/GetProjectDoc/"+this.ProjectCode).then((success)=>{
					var tempList=success.data;
					if(!tempList || tempList.length==0){
						return false;
					}
					this.docList=tempList;
				})
			},
			chooseImg () {
				var that=this;
				if(wx){
					wxutils.chooseImg(wx,(localId,resServerId)=>{ 
						//上传成功后,将文件显示到
						console.log("选取本地图片地址:"+localId)
						that.serverId=resServerId;
						that.imgPath=localId;
						that.fileCount=1;
						that.showfile=true;
					})
				}else{
					that.$root.toast={type:'cancel',text:'请在微信中打开网页',show:true};
				}
			},
			//上传验收报告
			saveProDoc () {
				var postData={
					"projectCode":this.ProjectCode,
					"docName": this.docType[0],
					"docDate":this.docDate,
					"memo":this.memo,
					"wxFileId":this.serverId
				};
				if(postData.docName=="无"){
					this.$root.toast={show:true,type:'cancel',text:'请选择文档类型'};
					return false;
				}
				//检查必填项是否都有填写
			    var isOk = common.checkPostData({
					"docName": this.docType[0],
					"docDate":this.docDate,
					"wxFileId":this.serverId
				});
				if(isOk){
					this.$root.toast={show:true,type:'cancel',text:'请填写必填项'};
					return false;
				}
				var that=this;
				// POST /someUrl
				that.$http.post("Project/UpProjectFile", postData).then((response) => {
					//提示保存成功
					that.$root.toast={type:'ok',text:'文件上传成功,请等待审核',show:true};
					that.docType=["无"];
					that.docDate="";
					that.memo="";
					//清空已经填写的内容
					that.imgPath="";
					that.fileCount=0;
					that.showfile=false;
					//重新加载文档信息
					that.loadDocList();
				});
			}
		}
	}

</script>

<style scoped>
	.app_ok {
		color: green;
		float: right;
		margin-right: 20px;
	}
	
	.app_wait {
		color: orange;
		float: right;
		margin-right: 20px;
	}
	
	.app_cancel {
		color: red;
		float: right;
		margin-right: 20px;
	}
	
	.vux-swiper {
		overflow: auto;
	}
	
	.custom {
		overflow: auto;
		height: 100%;
	}
</style>