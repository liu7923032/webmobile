<template>
	<div class="page project" transition="app">
		<x-header :left-options="{showBack:true,backText:'返回'}">
			<p>项目信息</p>
			<div slot="right">

			</div>
		</x-header>
		<tab>
			<tab-item :selected="selectIndex === 0" @click="switchTab(0)">
				我主导项目
			</tab-item>
			<tab-item :selected="selectIndex === 1" @click="switchTab(1)">
				我参与项目
			</tab-item>
		</tab>
		<div class="weui_tab_bd">
			<!-- 我主导的项目 -->
			<div v-show="selectIndex==0" class="subdb">
				<div class="box2">
					<cell v-for="item in mainData" is-link v-link="'/project/projectinfo/'+item.value">
						<div slot="after-title">
							<span style="color: black">{{item.name | substr 20}}</span>
						</div>
					</cell>
				</div>
				<x-button @click="mainMore" v-show="showMainBtn">点击加载更多</x-button>
				<div v-show="!showMainBtn" style="padding:10px 15px;color:blue;border:1px solid whitesmoke;">已经加载到最后了(●'◡'●)</div>
			</div>
			<!-- 我参与的项目 -->
			<div v-show="selectIndex==1" class="subdb">>
					<!--content slot-->
				<div class="box2">
					<cell v-for="item in partData" is-link v-link="'/project/projectinfo/'+item.value">
						<div slot="after-title">
							<span style="color: black;">{{item.name | substr 20}}</span>
						</div>
					</cell>
				</div>
				<x-button @click="partMore" v-show="showPartBtn">点击加载更多</x-button>
				<div v-show="!showPartBtn" style="padding:10px 15px;color:blue;border:1px solid whitesmoke;">已经加载到最后了(●'◡'●)</div>
			</div>
		</div>
	</div>
</template>

<script lang="babel">
	import XHeader from 'vux-components/x-header'
    import Group from 'vux-components/group'
    import Cell from 'vux-components/cell'
    // import Card from 'vux-components/card'

    import Box from 'vux-components/box'
    import XButton from 'vux-components/x-button'
	import {Tab,TabItem} from 'vux-components/tab'

	// import {Tab,TabItem,XHeader,Cell,Box,XButton} from 'vux-components'

	export default {
		name: 'project',
		data () {
			return {
				mainData:[],
				partData:[],
				selectIndex:0,
				mainIndex:0,
				partIndex:0,
				srcType:'',
				showMainBtn:true,
				showPartBtn:true
			}
		},
		methods: {
			switchTab (flag) {
				this.selectIndex=flag;
				if(flag==0&&this.mainData.length==0){
					this.mainMore();
				}else if(flag==1&&this.partData.length==0){
					this.partMore();
				}
			},
			mainMore () {
				var _this=this;
				_this.$http.get('Project',{type:0,pageIndex:_this.mainIndex}).then((response)=>{
					var jsonData=response.data;
					if(jsonData.length==0){
						_this.showMainBtn=false;
						return false;
					}
					if(_this.mainIndex==0){
						_this.mainData=response.data;
					}else{
						jsonData.forEach(u=>{
							_this.mainData.push(u);
						})
					}
					_this.mainIndex++;
				})
			},
			partMore () {
				var _this=this;
				_this.$http.get('Project',{type:1,pageIndex:_this.partIndex}).then((response)=>{
					var jsonData=response.data;
					if(jsonData.length==0){
						_this.showPartBtn=false;
						return false;
					}
					if(_this.mainIndex==0){
						_this.partData=response.data;
					}else{
						jsonData.forEach(u=>{
							_this.partData.push(u);
						})
					}
					_this.partIndex++;
				})
			}
		},
		components:{
			Tab,TabItem,XHeader,Cell,Box,XButton
		},
		route: {
			data (transition) {
				var that=this;
				this.mainMore();
			}
		}
	}
</script>


<style scoped>
	.subdb{
		padding-bottom:40px;
	}
</style>