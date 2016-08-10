import FastClick from 'fastclick'
import Vue from 'vue'
import Router from 'vue-router'
import routerMap from './routers'
import VueResource from 'vue-resource'
import auth from './views/utils/auth'
import App from './App.vue'
import filters from './filters/filters'
import common from './views/utils/common'


Vue.use(Router)
Vue.use(VueResource)

// 初始化过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))


// 1:设置访问的地址
Vue.http.options.root = 'http://e.mdsd.cn:9000/api'
// 2:启用emulateJSON选项，可以让浏览器不发送OPTIONS预请求
// Vue.http.options.root = 'http://localhost:9001/api';
// Vue.http.options.emulateJSON = true
Vue.http.options.emulateHTTP = true

// 3:设置拦截器
Vue.http.interceptors.push(function (request, next) {
    var that = this;
    //检查是否网络存在,通过网络来检查是否在线
    if (wx) {
        wx.getNetworkType({
            success: function (res) {
            },
            fail: function (res) {
                that.$root.toast = { show: true, text: "网络连接失败", type: 'cancel' };
                return false;
            }
        });
        if (localStorage) {
            var location = localStorage.getItem("location");
            request.headers["Location"] = location;
        }

    }
    if (this.$root && this.$root.loading) {
        this.$root.loading = { show: true, text: '加载中...' };
    }
    //在每次请求之前都加上人员的验证
    request.headers["Authorization"] = "BasicAuth " + auth.getTicket();
    //在每次请求之前都加上人员的验证

    next((response) => {
        //1:取消进度条显示
        if (this.$root && this.$root.loading && this.$root.loading.show) {
            this.$root.loading = { show: false, text: '' }
        }

        //对返回的结果提前检查
        if (response.status == 401) {
            router.redirect('/login');
        } else if (response.status == 0) {
            this.$root.toast = { show: true, type: 'cancel', text: '网络连接失败' }
            return false;
            // console.log("网络连接失败");
        }
        var resData = response.data;
        // 检查返回的结果是否异常
        if (typeof (resData) == "object") {
            if (resData.Statu && resData.Statu == "N") {
                this.$root.toast = { show: true, type: 'cancel', text: resData.Msg }
                return false;
            }
        }
        return response;
    });
});



// 创建一个路由器实例
// 创建实例时可以传入配置参数进行定制，为保持简单，这里使用默认配置


// 定义路由规则
// 每条路由规则应该映射到一个组件。这里的“组件”可以是一个使用 Vue.extend
// 创建的组件构造函数，也可以是一个组件选项对象。
// 稍后我们会讲解嵌套路由
//注册路由
var router = new Router({
    // hashbang: true,
    history: false,
    saveScrollPosition: true,
    // suppressTransitionError: true
})

routerMap(router)

//消除click延迟
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}


//权限检查
router.beforeEach(transition => {
    //处理左侧滚动不影响右边
    // $("html, body, #page").removeClass("scroll-hide");
    if (transition.to.auth) {
        if (auth.isLogin()) {
            transition.next();
        } else {
            var redirect = encodeURIComponent(transition.to.path);
            transition.redirect('/login?redirect=' + redirect);
        }
    } else {
        transition.next();
    }
});


// // // 发送请求和返回的拦截器
// Vue.http.interceptors.push(function () {
//     return {
//         request: function (request) {
//             var that = this;
//             //检查是否网络存在,通过网络来检查是否在线
//             if (wx) {
//                 wx.getNetworkType({
//                     success: function (res) {
//                     },
//                     fail: function (res) {
//                         that.$root.toast = { show: true, text: "网络连接失败", type: 'cancel' };
//                         return false;
//                     }
//                 });
//                 if (localStorage) {
//                     var location = localStorage.getItem("location");
//                     request.headers["Location"] = location;
//                 }

//             }
//             if (this.$root && this.$root.loading) {
//                 this.$root.loading = { show: true, text: '加载中...' };
//             }
//             //在每次请求之前都加上人员的验证
//             request.headers["Authorization"] = "BasicAuth " + auth.getTicket();
//             return request;
//         },
//         response: function (response) {
//             //1:取消进度条显示
//             if (this.$root && this.$root.loading && this.$root.loading.show) {
//                 this.$root.loading = { show: false, text: '' }
//             }

//             //对返回的结果提前检查
//             if (response.status == 401) {
//                 router.redirect('/login');
//             } else if (response.status == 0) {
//                 this.$root.toast = { show: true, type: 'cancel', text: '网络连接失败' }
//                 return false;
//                 // console.log("网络连接失败");
//             }
//             var resData = response.data;
//             // 检查返回的结果是否异常
//             if (typeof (resData) == "object") {
//                 if (resData.Statu && resData.Statu == "N") {
//                     this.$root.toast = { show: true, type: 'cancel', text: resData.Msg }
//                     return false;
//                 }
//             }
//             return response;
//         }
//     };
// })




// 现在我们可以启动应用了！
// 路由器会创建一个 App 实例，并且挂载到选择符 #app 匹配的元素上。
router.start(App, '#app')

