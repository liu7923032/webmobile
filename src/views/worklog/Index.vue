<template>
	<div class="page worklog">
		<x-header :left-options="{showBack:true,backText:'返回'}"> 
			<p>工作日志</p>
		</x-header>
		<group :title="groupTitle">
			<cell  v-for="item in dateRange"  is-link v-link="'/worklog/loginfo/'+item" >
				<div slot="icon" :class="{'week':($index==5 ||$index==6)}">{{ getZNWeek($index) }}</div>
				<div slot="after-title">
					<div class="time">
						{{item}}
					</div>
				</div>
			</cells>
		</group>
	</div>
	
</template>

<script>
	// import {XHeader,Group,Cell} from 'vux-components'

  import XHeader from 'vux-components/x-header'
  import Group from 'vux-components/group'
  import Cell from 'vux-components/cell'



	import DateHelper from 'src/assets/js/DateHelper.js'

	export default {
		name:'worklog',
		data(){
			return {
				title:'工作日志',
				startDay:'',
				endDay:'',
				dateRange:[]
			}
		},
		ready(){
			this.startDay=DateHelper.weekFirstDay();
			this.endDay=DateHelper.weekLastDay();
			this.dateRange=this.getDateRange();
			
		},
		computed:{
			groupTitle () {
				return "开始:"+this.startDay+" 结束:"+this.endDay;
			}
		},
		methods:{
			//子控件触发事件后执行的方法
			getDateRange(){
				var tempRange=[];
				//1:得到当前月份的天数
				var date=new Date();
				var month=date.getMonth()+1;
				var year=date.getFullYear();
				var days=DateHelper.dayNumOfMonth(year,month);
				//2:得到当前周的第一天
				var firstDay=parseInt(this.startDay.split('-')[2]);
				console.log(days);
				if(firstDay+6>days){
					//跨月加载数据
					//得到上个月的天数
					var preMonthDay=DateHelper.dayNumOfMonth(year,month);
					for (var i = firstDay; i <=preMonthDay; i++) {
						var tempDate=new Date(year+"/"+(month)+"/"+i);
						tempRange.push(
							DateHelper.formate(tempDate,"yyyy-MM-dd")
						);
					}
					var lastDay=parseInt(this.endDay.split('-')[2]);
					for (var i = 1; i <=lastDay; i++) {
						var tempDate=new Date(year+"/"+(month+1)+"/"+i);
						tempRange.push(
							DateHelper.formate(tempDate,"yyyy-MM-dd")
						);
					}

				}else{
					for (let i = firstDay,length=firstDay+7; i <length; i++) {
						var tempDate=new Date(year+"/"+month+"/"+i);
						tempRange.push(
							DateHelper.formate(tempDate,"yyyy-MM-dd")
						);
					};
				}
				return tempRange;
			},
			getZNWeek(flag){
				var array=["周一","周二","周三","周四","周五","周六","周日"];
				return array[flag];
			}
		},
		components:{
			Cell,
			XHeader,
			Group,
		}
	}
</script>

<style scoped>
	

	.week{
		color: red;
	}

	.time{
		margin-left: 10px;
	}

</style>