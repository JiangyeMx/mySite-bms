<template>
  <div class="HomeSlogan-container">
    <!-- 数据表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>
      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="handleCilck(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <!-- 标题 -->
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <!-- 描述 -->
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 中图 -->
              <UpLoad v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 大图 -->
              <UpLoad v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, getBanner, setBanner } from "@/api/banner.js";
import { SERVE_URL } from "@/serve_url.js";
import Upload from "@/components/Upload/UpLoad.vue";
export default {
  data() {
    return {
      data: [], //数据
      dialogFormVisible: false, //用于标记编辑页面是否显示
      form: {
        //编辑页面需要用到的表单
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
    };
  },
  components: {
    Upload,
  },
  methods: {
    fetchData() {
      getBanner().then((resp) => {
        this.data = resp.data;
        for (const item of resp.data) {
          item.midImg = SERVE_URL + item.midImg;
          item.bigImg = SERVE_URL + item.bigImg;
        }
      });
    },
    handleClick(resp) {
      //当 点击编辑按钮时，讲按钮对应行的数据给到编辑页面的的表单，
      this.form = [...resp];

      this.dialogFormVisible = true;
    },
    editBannerConfirm() {
      //编辑完成后 点击确定按钮触发该事件
      let temporaryArr = [...this.data];
      for (let i = 0; i < temporaryArr.length; i++) {
        if (temporaryArr[i].id == this.form.id) {
          temporaryArr[i] = this.form;
        }
      }
      setBanner(temporaryArr).then((resp) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchData();
      });
    },
  },
  created() {
    this.fetchData();
  },
};
</script>

<style></style>
