<template>
    <div class="page cservice">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            客服工作
            <a slot="right" href="javascript:void(0)" v-link="{path:'/cservice/newcswork'}">新增</a>
        </x-header>
        <tab>
            <tab-item :selected="selectIndex === 0" @click="selectIndex = 0">
                待处理
            </tab-item>
            <tab-item :selected="selectIndex === 1" @click="selectIndex = 1">
                流程中
            </tab-item>
            <tab-item :selected="selectIndex === 2" @click="selectIndex = 2">
                已完结
            </tab-item>
        </tab>
        <div class="weui-tab-bd">
            <div v-show="selectIndex == 0">
                <group title="待处理">
                    <cell v-for="item in waitData" is-link :title="item.HospName" v-link="{path:'/cservice/newcswork',query:{'dispNo':item.DispNo}}">
                    </cell>
                </group>
            </div>
            <div v-show="selectIndex == 1">
                <group title="流程中">
                </group>
            </div>
            <div v-show="selectIndex == 2">
                <group title="已完结">
                </group>
            </div>
          
        </div>
    </div>
</template>

<script lang="babel">
    

	import XHeader from 'vux-components/x-header'
    import Group from 'vux-components/group'
    import Cell from 'vux-components/cell'
    // import Card from 'vux-components/card'
	import {Tab,TabItem} from 'vux-components/tab'


// import	{ XHeader,Group,Cell,Tab, TabItem } from 'vux-components'

    export default {
        name:'cservice',
        //初始化数据
        data () {
            return {
                selectIndex:0,
                // 待处理的任务
                waitData:[]
            }
        },
        route:{
            data (transtion) {
                //加载当前人员的数据
                this.$http.get("CService/GetRecords/1").then((response)=>{
                    this.waitData=response.data;
                },(error)=>{

                })
            }
        },
        components:{
            XHeader,
            Group,
            Cell,
            Tab,
            TabItem
        },

    }
</script>