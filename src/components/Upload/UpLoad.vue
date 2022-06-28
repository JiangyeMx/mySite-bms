<template>
  <div class="UpLoad-container">
    <!-- 标题 -->
    <div class="title">{{ uploadTitle }}</div>

    <!-- 上传 -->
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :headers="headers"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import {SERVE_URL} from "@/serve_url";
export default {
  props: {
    uploadTitle: {
      default: "",
    },
    value: {
      default: "",
    },
  },
  computed:{
    imgUrl(){
      return SERVE_URL + this.value;
    },
    headers(){
      return {
        Authorization : "Bearer " + localStorage.getItem("adminToken")
      }
    },
  },
  methods: {
    handleAvatarSuccess(resp) {
      if(!resp.code && resp.data){
        //上传成功，服务器返回图片地址
        //提交input事件
        this.$emit("input",resp.data)
      }
    },
  },
};
</script>

<style scoped>
.title {
  margin: 15px 0;
  font-weight: 100;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
