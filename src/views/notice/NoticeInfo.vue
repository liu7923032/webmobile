<template>
    <div class="page noticeinfo">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            {{title}}
        </x-header>
        <div class="weui-tab-bd content">
            {{{content}}}
        </div>
    </div>
</template>


<script lang="babel">
    
    	import XHeader from 'vux-components/x-header'
    // import {XHeader} from 'vux-components'
    export default {
        name:'noticeinfo',
        data () {
            return {
                title:'',
                content:''
            }
        },
        components:{
            XHeader
        },
        route:{
            // 加载项目信息
            data (transition) {
                var serialNo=transition.to.params.no;
                this.loadInfo(serialNo);    
            }
        },
        methods:{
            loadInfo (serialNo) {
                this.$http.get("Notice/"+serialNo).then((res)=>{
                    var result=res.data;
                    if(!result){
                        return false;
                    }
                    this.title=result.DocTitle;
                    this.content=result.DocContent;
                });
            }
        }
    }
</script>

<style scoped>
    .content{
        padding:10px 5px;
    }
</style>