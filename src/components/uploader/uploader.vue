<template>
  <div class="weui_uploader">
    <div class="weui_uploader_hd">
      <span slot="body"><slot name="title"></slot></span>
      <span slot="footer" v-if="count >= 0 && maxlength > 0">{{count}}/{{maxlength}}</span>
    </div>
    <div class="weui_uploader_bd">
      <slot name="uploader-files"></slot>
      <div class="weui_uploader_input_wrp" v-if="hasInput">
        <input type="button" class="weui_uploader_input" @click="dispatchChange">
      </div>
    </div>
  </div>
</template>

<script>
// import Cell from 'vux/compon';

export default {
  props: {
    /**
     * 已上传文件数量
     * 注意，Uploader并不会对真实文件数量进行控制，count仅用于显示
     */
    count: {
      type: Number,
      required: false,
      validator: function(value) {
        return value >= 0;
      }
    },

    /**
     * 显示的最大可上传数量
     * 注意，Uploader并不会对真实文件数量进行控制，maxlength仅用于显示
     */
    maxlength: {
      type: Number,
      required: false,
      validator: function(value) {
        return value > 0;
      }
    },

    /**
     * 是否包含input元素
     */
    hasInput: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  methods: {
    dispatchChange(event) {
      console.log("触发事件");
      this.$emit('select-file', event);
    }
  }
 
}
</script>

<style scoped>
  .weui_uploader_input_wrp {
    float: left;
    position: relative;
    margin-right: 9px;
    margin-bottom: 9px;
    width: 77px;
    height: 77px;
    border: 1px solid #d9d9d9;
  }
  
  .weui_uploader_input_wrp:before,
  .weui_uploader_input_wrp:after {
    content: " ";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #d9d9d9;
  }
  
  .weui_uploader_input_wrp:before {
    width: 2px;
    height: 39.5px;
  }
  
  .weui_uploader_input_wrp:after {
    width: 39.5px;
    height: 2px;
  }
  
  .weui_uploader_input_wrp:active {
    border-color: #999999;
  }
  
  .weui_uploader_input_wrp:active:before,
  .weui_uploader_input_wrp:active:after {
    background-color: #999999;
  }
  
  .weui_uploader_input {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }
</style>