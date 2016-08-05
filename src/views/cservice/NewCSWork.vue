<template>
    <div class="page newcswork">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            新建工作
        </x-header>
        <div class="weui-tab-bd">
            <group title="基本信息">
                <datetime :value.sync="ReceiveTime" format="YYYY-MM-DD HH:mm" title="来电时间" confirm-text="完成" cancel-text="取消"></datetime>
                <datetime :value.sync="CompleteTime" format="YYYY-MM-DD HH:mm" title="完成时间" confirm-text="完成" cancel-text="取消"></datetime>
                <cell is-link title="医院名称" @click="loadHosps" :value.sync="hospName"> </cell>
                <cell is-link title="产品名称" @click="loadProducts" :value.sync="strProduct"></cell>
                <cell is-link title="联系人" @click="loadUsers" :value.sync="contactUser"></cell>
                <popup-picker title="故障类别" :data="categorys" :value.sync="category"></popup-picker>
                <popup-picker title="处理方式" :data="methods" :value.sync="execMethod"></popup-picker>
            </group>
            <group title="问题描述">
                <x-textarea :max="200" placeholder="详细问题描述'" :value.sync="desc" :height="100">
                </x-textarea>
            </group>
            <group title="解决方案">
                <x-textarea :max="500" placeholder="详细解决方案" :value.sync="solution" :height="150">
                </x-textarea>
            </group>
            <cell>
                <uploader slot="after-title" :count="fileCount" :maxlength="1" @select-file="chooseImg">
                    <span slot="title">文件上传</span>
                    <uploader-files slot="uploader-files" v-show="showfile" :image-url="imgPath">
                    </uploader-files>
                </uploader>
            </cell>
            <box gap="10px 10px" v-show="!showFlow">
                <x-button @click="addData" type="primary">新增</x-button>
            </box>
            <box gap="10px 10px" v-show="showFlow">
                <x-button @click="saveData" type="primary">保存</x-button>
            </box>
            <box gap="10px 10px" v-show="showFlow">
                <x-button @click="sendFlow" type="primary">发起流程</x-button>
            </box>
        </div>

        <!--选择医院的popup-->
        <popup :show.sync="showHosp" height="80%">
            <div class="popup">
                <tab>
                    <tab-item :selected="hospIndex==0" @click="hospIndex=0">
                        我的医院
                    </tab-item>
                    <tab-item :selected="hospIndex==1" @click="hospIndex=1">
                        所有医院
                    </tab-item>
                </tab>
                <div class="weui-tab-bd">
                    <div v-show="hospIndex==0">
                        <group>
                            <cell v-for="item in MyHosp" @click="selectHosp(item.HospId,item.HospName)" :title="item.HospName">
                            </cell>
                        </group>
                    </div>
                    <div v-show="hospIndex==1">
                        <search @result-click="resultClick" @on-submit="getResult" placeholder="输入关键字后回车" cancel-text="取消" :results="result" :value.sync="hospKey"></search>
                    </div>
                </div>
            </div>
        </popup>
        <!--产品-->
        <popup :show.sync="showProduct" height="80%">
            <div class="popup">
                <group>
                    <box gap="10px 10px">
                        <x-button @click="selectProduct" type="primary">确定选择</x-button>
                    </box>
                    <checklist title="选择产品" :options="productList" :value.sync="Product"></checklist>
                </group>
            </div>
        </popup>

        <!--医院联系人-->
        <popup :show.sync="showUser" height="80%">
            <div class="popup">
                <group title="医院联系人">
                    <radio :options="Users" @on-change="selectUser"></radio>
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
 import {Tab,TabItem} from 'vux-components/tab'
 

  import Checklist from 'vux-components/checklist'
 import Radio from 'vux-components/radio'

 import Selector from 'vux-components/selector'

// import	{ XHeader,Group,Cell,Tab, TabItem ,Scroller,PopupPicker,
    // Datetime,XInput,XTextarea,Box,XButton,Popup,Checklist,Radio,Selector,Search} from 'vux-components'
import 	{ Uploader, UploaderFiles, UploaderFile } from '../../components';
import common from '../utils/common.js'
import wxutils from '../utils/wxUtils'
    export default {
        name:'newcswork',
        data () {
            return {
                dispNo:"",
                ReceiveTime:"",
                CompleteTime:"",
                Hospital:[],
                MyHosp:[],
                // 医院
                showHosp:false,
                hospIndex:0,
                HospId:0,
                hospName:'',
                hospKey:'',
                result:[],
                // 产品
                showProduct:false,
                Product:[],
                strProduct:"",
                productList:[],
                // 医院联系人
                showUser:false,
                Users:[],
                contactUser:"",
                // 故障类别
                categorys:[["故障报修","系统巡检"]],
                category:[],
                // 处理方式
                methods:[["现场处理","远程处理"]],
                execMethod:[],
                // 附件上传
                fileCount:0,
                showfile:false,
                imgPath:'',
                // 问题描述
                desc:'',
                // 解决方案
                solution:'',
                // 发起流程
                showFlow:false,
                temp:"",
                serverId:""
            }
        },
        methods : {
            selectHosp (hospId,hospName) {
                this.HospId=hospId;
                this.hospName=hospName;
                this.showHosp=false;
            },
            // 选择产品
            selectProduct (){
                this.showProduct=false;
                //设置名称
                this.strProduct=this.Product.map((item)=>{
                    return item;
                }).join(',')
            },
            selectUser (value) {
                console.log(value);
                this.contactUser=value;
                this.showUser=false;
            },
            //微信选择图片
            chooseImg () {
                var that=this;
				if(wx){
					wxutils.chooseImg(wx,(localId,resServerId)=>{ 
						//上传成功后,将文件显示到
						that.serverId=resServerId;
						that.imgPath=localId;
						that.fileCount=1;
						that.showfile=true;
					})
				}else{
					that.$root.toast={type:'cancel',text:'请在微信中打开网页',show:true};
				}
            },
            chooseFile (e) {
                	//显示加载的文件
				this.showfile=true;
				var _this=this;
				//获取加载后的文件
				var file=event.target.files[0];
				if(!file){
					return false;
				}
				_this.attachFile=file;
				//读取上传的文件信息
				var reader = new FileReader();
				reader.onload = (evt)=>{
					var temp= evt.target.result
					_this.imgPath=temp;
					_this.fileCount=1;
				}
				var loaded = 0,total=file.size;  
				//每次读取1M  
			
				reader.onprogress=(e)=>{
					loaded += e.loaded;  
					//更新进度条  
					var temp = (loaded / total) * 100;  
				}
				reader.readAsDataURL(file);
            },
            //加载医院信息
            loadHosps () {
                this.showHosp=true;
                if(this.MyHosp.length==0){
                    this.$http.get("Hospital/GetMyCSHosp").then((response)=>{
                        this.MyHosp=response.data;
                    },(error)=>{

                    })
                }
            },
            resultClick (item) {
              
                this.HospId=item.hospId;
                this.hospName=item.title;
                this.showHosp=false;
            },
            getResult (value) {
                //从hosp中查询数据
                this.$http.get("Hospital/GetHospByKey/"+value).then((success)=>{
                    var resData=success.data;
                    //加载
                    var tempData=resData.map((item)=>{
                        return {
                            title:item.HospName,
                            hospId:item.HospId
                        }
                    });
                    this.result=tempData;
                })
                
                
            },
            // 加载产品信息
            loadProducts () {
                this.showProduct=true
                if(this.productList.length==0){
                    this.$http.get("SysDict/产品线").then((response)=>{
                        this.productList=response.data.map((item)=>{
                            return item.DictName;
                        });
                    },(error)=>{
                        
                    })
                }
            },
            // 加载联系人
            loadUsers () {
                var hospId=this.HospId;
                this.showUser=true;
                if(hospId==0){
                    //弹出错误提示
                    this.$root.toast = { show: true, type: 'cancel', text: '请先选择医院信息' };
                    return false;
                }
             
                if(this.Users.length==0&&hospId!=0){
                    this.$http.get("CService/GetContactUsers/"+hospId).then((response)=>{
                        this.Users=response.data;
                    },(error)=>{

                    });
                }
            },
            clearForm () {
                this.HospId=0;
                this.hospName="";
                this.ReceiveTime="";
                this.CompleteTime="";
                this.dispNo="";
                this.strProduct="";
                this.contactUser="";
                this.execMethod=[];
                this.productList=[];
                this.Users=[];
                this.category=[];
                this.fileCount=0;
                this.solution="";
                this.desc="";
                this.attachFile="";
                this.imgPath='';
                this.showFlow=false;
                this.showfile=false;
            },
            // 获取formData;
            getFormData () {
                var postData = {
                    "Category":this.category[0],
                    "ContactUser":this.contactUser,
                    "HospId":this.HospId,
                    "ProblemDesc":this.desc,
                    "Solution":this.solution,
                    "ProductIds":this.strProduct,
                    "ReceiveTime":this.ReceiveTime,
                    "CompleteTime":this.CompleteTime,
                    "ExecMethod":this.execMethod[0]
                };
              
                for (var key of Object.keys(postData)) {
                    if(postData[key]==0 || postData[key]==""){
                        console.log('key:'+key+"-value:"+postData[key]);
                        return false;
                    }
                    console.log(key + ": " + postData[key]);
                }
                if(this.serverId){
                      postData["serverId"]=this.serverId;
                }
                return postData;
            },
            // 编辑信息保存
            saveData () {
                var formData=this.getFormData();
                 if(!formData){
                    this.$root.toast={type:'cancel',text:'请完善必填信息',show:true};
                    return false;
                }
                var that=this;
                this.$http.post("CService/SaveRecord/"+this.dispNo,formData).then((response)=>{
                    // that.$root.toast={show:false,type:'ok',text:'保存成功'};
                    that.$router.go({path:'/cservice'});
                },(error)=>{

                })
            },
            // 新增记录
            addData () {
                var formData=this.getFormData();
                if(!formData){
                    this.$root.toast={type:'cancel',text:'请完善必填信息',show:true};
                    return false;
                }
                // 检查一下数据是否都有效
                var that=this;
                this.$http.post("CService/AddRecord",formData).then((response)=>{
                    that.$root.toast={show:false,type:'ok',text:'新增成功'};
                    //调整到指定页面
                    that.$router.go({path:'/cservice'});
                    // common.procResult(response,(resData)=>{
                    // });
                },(error)=>{

                })
            },
            // 发起流程
            sendFlow () {
                var formData={aa:'11',text:'11'};
				var postData={
					WFNo:'ccc019c9-0797-4288-bfa5-4f2e3ec0ff20',
					SourcePK:'',
					FlowNo:'',
					FlowName:'流程标题',
					FlowJson:JSON.stringify(formData),
					FlowMemo:'备注嘻嘻你',
					FlowStatus:'0',
					SubUserId:'10685',
					NextUser:'',
					NextStepNo:'',
					Comment:'我统一'
				}
				this.$http.post("WFlow/SaveForm",JSON.stringify(postData)).then((success)=>{

				},(error)=>{

				})
            }
        },
        route:{
            data (transition) {
                var dispNo=transition.to.query.dispNo;
                if(!dispNo||dispNo==''){
                    //清空数据
                    this.clearForm();
                    return false;
                }
                this.showFlow=true;
                this.dispNo=dispNo;
                //加载基本信息
                this.$http.get("CService/GetRecordByNo/"+this.dispNo).then((res)=>{
                    var obj=res.data || undefined;
                    if(!obj){
                        return false;
                    }
                    this.ReceiveTime=obj.ReceiveTime; 
                    this.CompleteTime=obj.CompleteTime; 
                    this.HospId=obj.HoptalId;
                    this.hospName=obj.HospName;
                    this.strProduct=obj.ProductIds;
                    this.contactUser=obj.ContactUser; 
                   
                    var tempExec=[],tempCate=[];
                    tempCate.push(obj.Category)
                    this.category=tempCate;
                    if(obj.ExecMethod=="CLFS0002"){
                         this.execMethod=["现场处理"]
                    }else{
                        this.execMethod=["远程处理"]
                    }
                    this.solution=obj.Solution;
                    this.desc=obj.ProblemDesc;
                    if( obj.FileUrl.length>0 ) {
                        //替换 E:\PMIS_DOC
                        var tempFile=obj.FileUrl.replace(/\\/g,"//");
                        console.log(tempFile);
                        var fileUrl=tempFile.replace(/E:/,"http://e.mdsd.cn:9000");
                        console.log(fileUrl);
                        this.imgPath=fileUrl;
                        this.showfile=true;
                        this.fileCount=1;
                    }
                },()=>{

                })
            }
        },
        components:{
            XHeader,
            Cell,
            Tab,
            TabItem,
            Scroller,
            Datetime,
            Group,
            Popup,
            XButton,
            Checklist,
            Box,
            Radio,
            PopupPicker,
            Uploader, UploaderFiles, UploaderFile,
            XTextarea,
            Selector,
            Search
        },
    }
</script>

<style type="text/less">
    li {
        list-style: none;
    }
    
    .popup {
        height: 100%;
        overflow: auto;
    }

        .weui_cell_bd {
            p{ 
                color:red;
            }
        }
   
</style>