<template>
    <div class="page approve">
        <x-header :left-options="{showBack:true,backText:'返回'}">
            流程详情
        </x-header>
        <tab>
            <tab-item :selected="selectIndex === 0" @click="selectIndex = 0">
                流程表单
            </tab-item>
            <tab-item :selected="selectIndex === 1" @click="selectIndex = 1">
                流程签核
            </tab-item>
        </tab>
        <swiper :index.sync="selectIndex" :dots-class="custom" height="1024px" :show-dots="false">
            <swiper-item class="swiperItem">
                <group title="表单详情">

                </group>
            </swiper-item>
            <swiper-item class="swiperItem">
                <!--签核记录-->
                <timeline>
                    <timeline-item v-for="item in stepList">
                        <h4 :class="getStatusCss(item.FlowStatus)">处理人:{{item.ApproveUser}} 状态:{{getStatusName(item.FlowStatus) }}</h4>
                        <p>到达:{{item.CreateTime | substr 13}} 审批:{{item.ApproveDate}}</p>
                        <p>意见:{{item.Comment}}</p>
                    </timeline-item>

                </timeline>
                <divider>签核过程</divider>
                <!--签核操作-->
                <flexbox>
                    <flexbox-item :span="1/2">
                        <box gap="10px 10px">
                            <x-button type="warn" @click="reject">
                                驳回
                            </x-button>
                        </box>
                    </flexbox-item>
                    <flexbox-item :span="1/2">
                        <box gap="10px 10px">
                            <x-button type="primary" @click="approve">
                                签核
                            </x-button>
                        </box>
                    </flexbox-item>
                </flexbox>
            </swiper-item>
        </swiper>

    </div>
</template>

<script lang="babel">
    import XHeader from 'vux-components/x-header'
    import Group from 'vux-components/group'
    import Cell from 'vux-components/cell'
	import {Tab,TabItem} from 'vux-components/tab'
    import Swiper from 'vux-components/swiper'
	import SwiperItem from 'vux-components/swiper-item'
    import Flexbox from 'vux-components/flexbox'
    import FlexboxItem from 'vux-components/flexbox-item'
    import Box from 'vux-components/box' 
    import XButton from 'vux-components/x-button'
    import {Timeline,TimelineItem} from 'vux-components/timeline'
  import Divider from 'vux-components/divider'
  
    export default {
        data () {
            return {
                selectIndex:0,
                stepList:[],
                instNo:""
            }
        },
        props:{
            instName:{
                type:String,
                default:''
            }
        },
        route:{
            data (transtion) {
                   console.log(transtion)
                this.instNo=transtion.to.params.instNo;
             
                // 1:加载签核步骤
                this.loadStep();
            }
        },
        components:{
            XHeader,
            Group,
            Cell,
            Tab,
            TabItem,
            Swiper,
            SwiperItem,
            Flexbox,
            FlexboxItem,
            Box,
            XButton,
            Timeline,
            TimelineItem,
            Divider
        },
        methods:{
            getStatusName (flag) {
                switch (flag) {
                    case -1:
                        return "待处理"
                    case 0:
                         return "驳回"
                    case 1:
                        return "同意"
                    break;
                    case 4:
                        return "转交"
                    case 5:
                        return "关闭"
                }
            },
            getStatusCss (flag){
                 switch (flag) {
                    case -1:
                        return "wait"
                    case 0:
                         return "reject"
                    case 1:
                        return "yes"
                    break;
                    case 4:
                        return "deliver"
                    case 5:
                        return "close"
                }
            },
            approve () {
                alert('11')
            },
            reject () {
                alert("12")
            },
            loadStep () {
                if(this.stepList.length>0){
                    return false;
                }
                var reqUrl="QueryFlow/GetApproveRecord/"+this.instNo;
                this.$http.get(reqUrl).then((res)=>{
                    this.stepList=res.data;
                });
            }
        }

    }
</script>


<style lang="less">
    .approve {
        p {
            color: #888;
            font-size: 0.8rem;
        }
        h4 {
            color: #666;
            font-weight: normal;
        }
        .recent {
            color: rgb(4, 190, 2)
        }
    }
</style>