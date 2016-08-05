<template>
    <div class="page konwn">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            {{title}}
        </x-header>
        <div class="weui-tab-bd">
           还没有内容哦
        </div>
    </div>
</template>


<script lang="babel">

    import XHeader from 'vux-components/x-header'
    // import {XHeader} from 'vux-components'
    export default {
        name:'konwn',
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
            }
        }
    }
</script>