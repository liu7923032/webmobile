<template>
	<div class="page project" transition="app">
		<x-header :left-options="{showBack:true,backText:'返回'}">
			<p>文件上传</p>
		</x-header>
		<div class="weui_tab_bd">
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
	</div>
</template>

<script lang="babel">
	import XHeader from 'vux-components/x-header'
    import Group from 'vux-components/group'
    import Cell from 'vux-components/cell'
    import Popup from 'vux-components/popup'
    import Datetime from 'vux-components/datetime'
    import PopupPicker from 'vux-components/popup-picker'
    import XInput from 'vux-components/x-input'
    import XTextarea from 'vux-components/x-textarea'
    import XButton from 'vux-components/x-button'
    import Box from 'vux-components/box'

	// import {Tab,TabItem,XHeader,Cell,Box,XButton} from 'vux-components'
    import 	{ Uploader, UploaderFiles, UploaderFile } from '../../components';
    import common from '../utils/common';
import wxutils from '../utils/wxUtils'
	export default {
		name: 'upfile',
		data () {
			return {
				ProjectCode:'',
                docTypeList:[["无"]],
				docType:["无"],
				docList:[],
				docDate:'',
				memo:'',
				// 文件上传涉及的变量
				showfile:false,
				imgPath:'',
				fileCount:0,
				serverId:'',
                StageNo:''
			}
		},
        ready () {
			common.initWX();
		},
		methods: {
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
			},
		},
		components:{
            Cell,
            XHeader,
            Group,
			PopupPicker,
			Datetime,
			XInput,
			XTextarea,
			Uploader, UploaderFiles, UploaderFile,
			Box,XButton,
		},
		route: {
			data(transition){
				this.ProjectCode=transition.to.params.id;
                this.StageNo=transition.to.query.stageNo;
				//加载基本信息
				this.loadDocs();
			}
		}
	}
</script>


<style scoped>
	.subdb{
		padding-bottom:40px;
	}
</style>