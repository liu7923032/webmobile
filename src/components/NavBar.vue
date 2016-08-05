<template>
	<header class="page-hd">
        <p>{{text}}</p>
        <div>
            <div class="left">
                <slot name="leftBar"></slot>
            </div>
            <div class="right">
                <slot name="rightBar"></slot>
            </div>
        </div>
    </header>
</template>


<script lang="babel"> 
	export default {
		props: {
			text: {
				type: String,
                required: false
			}
		}
	}
</script>

<style type="text/css">
	   .page-hd {
            width: 100%;
            height: 44px;
            background-color: white;
            line-height: 44px;
            padding: 0px 15px;
            position: relative;
			box-shadow: 0px 1px 2px #E6E6E6;
			overflow: hidden;
            font-size: 17px;
            margin-bottom: 1px;
        }
        /*按钮的层*/
        .page-hd>div {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 15;
            width: 100%;
            padding: 0px 15px;
        }
        
        /*标题*/
        .page-hd>p {
            text-align: center;
            margin: 0px;
            vertical-align: middle;
            position: absolute;
            width: 100%;
            left: 0;
            top: 0;
        }
        
        .page-hd .left {
            float: left;
        }
        
        .page-hd .right {
            float: right;
        }
</style>