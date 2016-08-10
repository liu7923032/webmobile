<template>
    <div id="app">
        <!-- main view -->
        <router-view class="view" keep-alive transition="slide">
        </router-view>

        <toast :show.sync="toast.show" :type="toast.type" :time="2000">
            <p>{{toast.text}}</p>
        </toast>

        <loading :show.sync="loading.show" :text="loading.text">
        </loading>


    </div>
</template>



<script lang="babel">
  

    import Toast from 'vux-components/toast'
    import Loading from 'vux-components/loading'
    import Alert from 'vux-components/alert'

    import auth from './views/utils/auth.js'
    import common from './views/utils/common.js'
    import wxUtils from './views/utils/wxUtils'

    export default {
      data () {
        return {
           ticket:'',
           loading:{ show:false,text:'加载中'},
           toast: { show:false, type:'cancel',text:'网络连接失败'},
           alert:{ show:false,text:""}
        }
      },
      components:{
        Toast,
        Loading,
        Alert
      },
      created () {
            //检查请求地址是否包含tickt,如果包含那么就代表用户是通过微信登陆
            var ticketUrl=common.getUrlParam("ticket");
            var account=common.getUrlParam("account");
            var sign=common.getUrlParam("sign");
           
            if(ticketUrl.length>10){
                //设置用户登录信息
                auth.setUser(account,ticketUrl,true);
            }
            if(sign.length>0){
                var signArray=sign.split('|');
                wxUtils.setWXCfg(signArray[0],signArray[1],signArray[2],signArray[3]);
                
            }
            //检查是否登陆
            if(auth.isLogin()){
                this.ticket=auth.getTicket();
                this.$http.headers.common['Authorization'] = this.ticket;
            }
      },
     
      route:{
        data(transition){
            if(!auth.isLogin()){
               transition.redirect('/login');
            }
        }
      }
    }
</script>
<style lang="less">
    /*@import '~vux/dist/vux.css';*/
    
    @import '~vux/src/styles/reset';
    /*当你设置一个元素为 box-sizing: border-box; 时，此元素的内边距和边框不再会增加它的宽度*/
    
    * {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    /*单页面的布局*/
    
    html,
    body {
        -webkit-tap-highlight-color: transparent;
        overflow-x: hidden;
    }
    
    body,
    .page {
        background-color: #FBF9FE;
        /*background-color: #F5E1BA;*/
    }
    /*最底层布局*/
    
    .container {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
    /*页面的布局*/
    
    .page {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
    
    .space {
        padding: 5px 15px;
    }
    
    .page.slideIn {
        animation: slideIn .2s forwards;
    }
    
    .page.slideOut {
        animation: slideOut .2s forwards;
    }
    /*页面切换动画*/
    
    @keyframes slideIn {
        from {
            transform: translate3d(100%, 0, 0);
        }
        to {
            transform: translate3d(0, 0, 0);
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translate3d(0, 0, 0);
        }
        to {
            transform: translate3d(100%, 0, 0);
        }
    }
    
    .slide-transition {
        transition: left 0.3s ease;
        width: 100%;
    }
    
    .slide-enter,
    .slide-leave {
        left: 100%;
    }
    
    .slide-leave {
        left: 100%;
    }
    
    .app-transition {
        transition: opacity 0.3s ease;
    }
    
    .app-enter,
    .app-leave {
        opacity: 0;
    }
    
    .weui-tab-bd {
        height: 90%;
        overflow: auto;
        padding-bottom: 25px;
    }
    
    .tab-swiper {
        background-color: #fff;
        height: 100%;
    }
    
    .swiperItem {
        overflow: auto;
        padding-bottom: 20px;
        ;
    }
    /*a{
       text-decoration:none;
    }
    p{
        margin:0px;
    }*/
    /*内容的布局*/
    /*.page-bd {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    padding-top: 4px;
}
*/
    /*改变weui的背景色*/
</style>