<template>
	<div class="page logInfo">
		<x-header  :left-options="{showBack:true,backText:'返回'}" >
			<p>{{curDay}}</p>
			<a @click="addTask" slot="right">新增</a>
		</x-header>
		<group>
			<cell v-for="item in logInfo" >
				<div slot="after-title">
					<table class="log">
						<tbody>
							<tr>
								<td class="tdLabel">日志名称</td>
								<td>{{item.LogTitle}}</td>
							</tr>

							<tr>
								<td class="tdLabel">开始时间</td>
								<td>{{item.SDate}}</td>
							</tr>
							<tr>
								<td class="tdLabel">结束时间</td>
								<td>{{item.EDate}}</td>
							</tr>
							<tr>
								<td class="tdLabel">工作类型</td>
								<td >{{item.WType}}</td>
							</tr>
							
							<tr>
								<td class="tdLabel">详细信息</td>
								<td>{{{ item.Remark | replace '\n' '&lt;br /&gt;' }}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</cell>
		</group>
	</div>
</template>


<script lang="babel">
	
 import Group from 'vux-components/group'
 import Cell from 'vux-components/cell'
 import XHeader from 'vux-components/x-header'

	// import {Group,Cell,XHeader} from 'vux-components'
	import auth from '../utils/auth'

	export default {
		name:'loginfo',
		data(){
			return {
				curDay:'',
				logInfo: [],
				rightBtn:{
					showMore:true
				}
			}
		},
		route:{
			//加载数
			data(transition){
				//加载数据
			  this.curDay=transition.to.params.date;
			  var rUrl='WorkLog/'+this.curDay+"";

			  this.$http.get(rUrl).then((response)=>{
			  	this.logInfo=response.data;
			  },(error)=>{
			  	
			  });
			}
		},
		components:{
			Cell,
			Group,
			XHeader
		},
		methods:{
			back(){
				history.back();
			},
			addTask(){
				var addPath="/worklog/logdetail/"+this.curDay+"?type=add";
				this.$route.router.go({path:addPath});
			}
		}
	}
</script>

<style type="text/css">
	.logInfo table{
		width: 100%;
		border-collapse:collapse;
		border-spacing:0;
	}
	.logInfo tr{
		border-bottom:1px dashed lightblue;
	}
	.logInfo tr:last-child{
		 border-bottom: none;
	}

	.logInfo td{
		padding: 5px;
	}
	.tdLabel{
		width: 100px;
	}
	
</style>