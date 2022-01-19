<template>
  <div>
    <el-card class="box-card">
      <div style="display: flex">
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
        </div>
        <el-button
          style="margin-left: 300px"
          type="primary"
          size="small"
          @click="searchGpa()"
          >查询</el-button
        >
      </div>

      <!-- 绩点表格 -->
      <el-table
        :data="gpaInfo"
        border
        style="width: 100%; margin-top: 10px"
        size="small"
      >
        <el-table-column prop="studentId" label="学号" align="center">
        </el-table-column>
        <el-table-column prop="year" label="学年" align="center">
        </el-table-column>
        <el-table-column prop="term" label="学期" align="center">
        </el-table-column>
        <el-table-column prop="gpa" label="绩点" align="center">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style scoped>
.sc_year {
  font-size: 14px;
  width: 42%;
}
</style>
<script>
export default {
  data() {
    return {
      yearTerms: [],
      value: "",
      //查询参数
      gpaQuery: {
        token: this.token,
        studentId: this.studentId,
        year: "",
        term: "",
      },
      // 绩点成绩信息
      gpaInfo: [],
    };
  },
  created() {
    this.gpaQuery.token = this.token;
    this.gpaQuery.studentId = this.studentId;
    this.getYearTerm();
    this.searchGpa();
  },
  methods: {
    async searchGpa() {
      const { data: res } = await this.$http.post(
        "api/student/gpa",
        this.qs.stringify(this.gpaQuery)
      );
      if (res.code !== 1020) return this.$message.error("查询绩点失败");
      this.gpaInfo.push(res.data);

      console.log(this.gpaInfo);
    },
    //获取学年
    async getYearTerm() {
      const { data: res } = await this.$http.post("api/yearTerm");
      if (res.code !== 1020) return this.$message.error("获取学期失败");
      this.yearTerms = res.data.yearTerms;
    },
    //当查询学期学年改变时
    yearChange(value) {
      const res = value.split("   ");
      this.gpaQuery.year = res[0];
      this.gpaQuery.term = res[1];
    },
  },
  computed: {
    studentId() {
      return window.sessionStorage.getItem("studentId");
    },
    token() {
      return window.sessionStorage.getItem("token");
    },
  },
};
</script>