<template>
	<div class="page-bd" @scroll="scroll($event)" >
		<slot></slot>	
	</div>
</template>

<script>
	export default {
	  methods: {
			scroll (e) {
				this.$broadcast("scroll",e);
			}
	  }
	}
</script>

<style type="text/css" scoped>
	.page-bd {
	    overflow: auto;
	    -webkit-overflow-scrolling: touch;
	    width: 100%;
	    height: 100%;
	    padding-top: 4px;
	    position: absolute;
        left: 0;
	}
</style>