<template>
  <div class="page" transition="app">
    <x-header :left-options="{showBack: false}">
      首页
      <a slot="right" href="javascript:void(0)" @click.prevent="scan">扫描</a>
    </x-header>

    <swiper :index.sync="selectIndex" :dots-class="custom" height="521px" :show-dots="false">
      <swiper-item class="swiperItem">
        <div class="box2">
          <card v-for="item in msgItems" :header="{title:item.MsgTitle}">
            <div slot="content" class="card_bd">
              {{item.MsgContent}}
            </div>
          </card>
        </div>
      </swiper-item>
      <swiper-item class="swiperItem">
        <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/3" v-for="item in items" v-link="'/'+item.link">
            <div class="grid">
              <img :src="item.image" alt="">
              <div>{{item.text}}</div>
            </div>
          </flexbox-item>
        </flexbox>
      </swiper-item>
      <swiper-item class="swiperItem">
        <Group title="个人基本信息">
          <cell title="工号">
            <div slot="value">
              <span style="color: green">{{user.GongHao}}</span>
            </div>
          </cell>
          <cell title="姓名">
            <div slot="value">
              <span style="color: green">{{user.UserName}}</span>
            </div>
          </cell>
          <cell title="部门">
            <div slot="value">
              <span style="color: green">{{user.DeptName}}</span>
            </div>
          </cell>
          <cell title="岗位">
            <div slot="value">
              <span style="color: green">{{user.PostName}}</span>
            </div>
          </cell>
          <cell title="年假">
            <div slot="value">
              <span style="color: green">{{user.YearDays}}</span>
            </div>
          </cell>
          <cell title="福利假">
            <div slot="value">
              <span style="color: green">{{user.ServiceDays}}</span>
            </div>
          </cell>
        </Group>
      </swiper-item>
    </swiper>

    <tabbar :index.sync="selectIndex">
      <tabbar-item selected @click="selectIndex = 0">
        <img slot="icon" src="../assets/images/app/icon_nav_msg.png">
        <span slot="label">消息</span>
      </tabbar-item>
      <tabbar-item @click="selectIndex = 1">
        <img slot="icon" src="../assets/images/app/icon_nav_actionSheet.png">
        <span slot="label">应用</span>
      </tabbar-item>
      <tabbar-item @click="selectIndex = 2">
        <img slot="icon" src="../assets/images/app/icon_nav_cell.png">
        <span slot="label">我</span>
      </tabbar-item>
    </tabbar>



  </div>
</template>

<script lang="babel">
 

 import {Tabbar,TabbarItem} from 'vux-components/tabbar'
//  import TabbarItem from 'vux-components/tabbar'
 import XHeader from 'vux-components/x-header'
 import Flexbox from 'vux-components/flexbox'
 import FlexboxItem from 'vux-components/flexbox-item'
 import Scroller from 'vux-components/scroller'
 import Divider from 'vux-components/divider'
 import Spinner from 'vux-components/spinner'
 import Group from 'vux-components/group'
 import Cell from 'vux-components/cell'
 import Card from 'vux-components/card'
 import Swiper from 'vux-components/swiper'
 import SwiperItem from 'vux-components/swiper-item'
 import common from './utils/common'
 import wxUtils from './utils/wxUtils'

export default {
  name: 'index',
  
  data () {
    return {
      items: [{
        link: 'project',
        image:'./static/images/app/icon_nav_cell.png',
        text: '项目',
      }, {
        link: 'cservice',
        image:'./static/images/app/icon_nav_article.png',
        text: '客服'
      }, {
        link: 'worklog',
        image:'./static/images/app/icon_nav_icons.png',
        text: '日志'
      }, {
        link: 'workflow',
        image:'./static/images/app/icon_nav_tab.png',
        text: '流程'
      }, {
        link: 'notice',
        image:'./static/images/app/icon_nav_article.png',
        text: '系统公告'
      }, {
        link: 'known',
        image:'./static/images/app/icon_nav_dialog.png',
        text: '知识分享'
      }],
      selectIndex:0,
      msgItems:[{
        type:"0",
        title:'我的测试一下'
      }],
      pulldownStatus:"default",
      user:{"UserName":'',"PostName":'',"DeptName":'',"GongHao":'',"YearDays":0,"ServiceDays":0},
      isFirst:0
    }
  },
  components: {
    Tabbar,
    TabbarItem,
    XHeader,
    Flexbox, 
    FlexboxItem,
    Scroller, 
    Divider, 
    Spinner,
    Cell,
    Group,
    Card,
    Swiper,
    SwiperItem
  },
  route: {
    data (transition) {
      //检查人员是否登陆成功,如果登陆成功就不再加载人员信息了
      if(this.user.UserName.length==0){
         this.getUserInfo();
      }
      if(this.isFirst==0){
        this.loadMsg();
      }
    }
  },
  ready () {
      wxUtils.getLocation((lat,long)=>{
        console.log("得到的维度:"+lat+",得到的精度:"+long);
          this.$http.post("Common/Login",{"latitude":lat,"longitude":long}).then((res)=>{
          })
      });
  },
  methods: {
    update () {
    },
    scan () {
      // wx.scanQRCode({
      //   needResult: 1,
      //   desc: '扫描测试',
      //   success: function (res) {
      //     alert("扫描成功");
      //     // alert(JSON.stringify(res));
      //   }
      // });
       wxUtils.getLocation((lat,long)=>{
            alert("得到的维度:"+lat+",得到的精度:"+long);
            this.$http.post("Common/Login",{"latitude":lat,"longitude":long}).then((res)=>{
            })
        });
    },
    onItemClick (a) {
    },
    getUserInfo(){
      this.$http.get("UserInfo").then((success)=>{
        this.user=success.data;
      });
    },
    loadMsg () {
      var that=this;
      this.$http.get("Message").then((res)=>{
        that.msgItems=res.data;
        this.isFirst=1;
      });
    }
  }
}
</script>

<style scoped>
  .card_bd {
    padding: 10px 15px;
  }
  
  .page-bd>.title {
    width: 100%;
    text-align: center;
    margin: 10px 0px;
  }
  
  .title>p {
    font-size: 12px;
  }
  
  .grid {
    text-align: center;
    padding: 15px;
    border-right: 1px solid lightgray;
    border-bottom: 1px solid lightgray;
  }
  
  .grid img {
    width: 40px;
    height: 40px;
  }
  
  .rotate {
    transform: rotate(-180deg);
  }
  
  .pulldown-arrow {
    display: inline-block;
    transition: all linear 0.2s;
    color: #666;
    font-size: 25px;
  }
</style>