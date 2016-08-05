
<template>
    <div class="page notice">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            公司新闻
        </x-header>
        <div class="weui-tab-bd">
             <card v-for="item in noticeData" :header="{title:item.TypeName}" :footer="{title:'查看详情',link:'/notice/noticeinfo/'+item.SerialNo}">
                <div slot="content" class="card_bd" >
                    {{item.DocTitle}}
                </div>
            </card>
        </div>
    </div>

</template>

<script lang="babel">

    import XHeader from 'vux-components/x-header'
    import Group from 'vux-components/group'
    import Cell from 'vux-components/cell'
    import Card from 'vux-components/card'

    // import { XHeader,Cell,Group,Card } from 'vux-components'
    export default {
        name:'notice',
        data () {
            return {
                noticeData:[],
            }
        },
        components : {
            XHeader,
            Cell,
            Group,
            Card
        },
        route:{
            data (transtion) {
                //加载待处理的流程
                this.$http.get("Notice").then((res)=>{
                    this.noticeData=res.data;
                });
            }
        },
        methods:{
            newFlow () {
                this.$root.toast={show:true,text:'未完成,请稍后'};
            }
        }
    }
</script>

<style scoped>

    .flow_info{
        margin-top:5px;
        padding: 5px 0px;
        display:flex;
        font-size:14px;
        color:gray;
        justify-content:space-between;
        font-weight:200;
    }

    .card_bd{
        padding:15px 15px;
    }

</style>