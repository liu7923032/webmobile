<template>
    <div class="page workflow">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            待审流程
            <a slot="right" @click="newFlow">发起</a>
        </x-header>
        <div class="weui-tab-bd">
             <card v-for="item in waitData" :header="{title:'流程编号:'+item.FlowNumber}" :footer="{title:'审批流程',link:'/workflow/approve/'+item.InstNo}">
                <div slot="content" class="card_bd" >
                    {{item.InstName}}
                    <div  class="flow_info">
                        <span>发起人:{{item.SubUser}}</span>
                        <span>发起时间:{{item.SubTime | substr 10}}</span>
                    </div>
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
        data () {
            return {
                waitData:[],
            }
        },
        methods : {

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
                this.$http.get("QueryFlow/GetWaitFlow").then((res)=>{
                    this.waitData=res.data;
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