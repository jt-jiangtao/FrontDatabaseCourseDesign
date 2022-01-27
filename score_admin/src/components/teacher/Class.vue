<template>
  <div>
    <el-card>
      <div class="sc_year">
        <span class="sc_text">学期学年 : </span>
        <el-select
          v-model="value"
          placeholder="请选择"
          size="small"
          @change="yearChange(value)"
        >
          <el-option
            v-for="item in yearTerms"
            :key="item.id"
            :value="item.year + '   ' + item.term"
          >
          </el-option>
        </el-select>
        <el-button type="primary" size="small" class="btn" @click="getClass"
          >查询</el-button
        >
      </div>
      <!-- 表格区域 -->
      <el-table
        :data="classInfo.courses"
        border
        size="small"
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column align="center" prop="id" label="课程号" width="80">
        </el-table-column>
        <el-table-column
          align="center"
          prop="name"
          label="课程名称"
          width="180"
        >
        </el-table-column>
        <el-table-column align="center" prop="property" label="课程类型">
        </el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间">
        </el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间">
        </el-table-column>
        <el-table-column align="center" prop="time" label="课时" width="80">
        </el-table-column>
        <el-table-column align="center" prop="score" label="学分" width="80">
        </el-table-column>
        <el-table-column align="center" prop="property" label="课程类型">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      //选中的学期学年的值
      value: "2021-2022    第一学期",
      yearTerms: [],
      classQuery: {
        token: "",
        teacherId: "",
        year: "",
        term: "",
      },
      classInfo: {},
    };
  },
  methods: {
    //获取学年
    async getYearTerm() {
      const { data: res } = await this.$http.post("api/yearTerm");
      if (res.code !== 1020) return this.$message.error("获取学期失败");
      this.yearTerms = res.data.yearTerms;
    },
    // 获取所带班级
    async getClass() {
      const { data: res } = await this.$http.post(
        "api/teacher/course",
        this.qs.stringify(this.classQuery)
      );
      this.classInfo = res.data;
      console.log(this.classQuery);
    },
    //当查询学期学年改变时
    yearChange(value) {
      const res = value.split("   ");
      this.classQuery.year = res[0];
      this.classQuery.term = res[1];
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    //获取学年
    this.classQuery.token = this.token;
    this.classQuery.teacherId = this.userInfo.data.info.teacherId;
    this.getYearTerm();
    this.getClass();
  },
  computed: {
    token() {
      return window.sessionStorage.getItem("token");
    },
  },
};
</script>

<style scoped>
.btn {
  margin-left: 250px;
}
.sc_year {
  margin-left: 300px;
  font-size: 14px;
}
</style>