<template>
  <div>
    <el-card>
      <div class="sc_year">
        <span class="sc_text">学期学年 : </span>
        <el-select v-model="value" placeholder="请选择" size="small" @change="yearChange(value)">
          <el-option v-for="item in yearTerms" :key="item.id" :value="item.year + '   ' + item.term"> </el-option>
        </el-select>
        <el-button style="margin-left: 250px" type="primary" size="small" class="btn" @click="getCourseInfo">查询</el-button>
      </div>
      <el-table :data="courseInfo" border size="small" style="width: 100%; margin-top: 10px">
        <el-table-column align="center" prop="deptName" label="学院"> </el-table-column>
        <el-table-column align="center" prop="teacherName" label="教师名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="teacherId" label="教师工号"> </el-table-column>
        <el-table-column align="center" prop="specialtyName" label="专业"> </el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称"> </el-table-column>
        <el-table-column align="center" prop="property" label="课程类型"> </el-table-column>
        <el-table-column align="center" prop="startTime" label="开始时间" width="80"> </el-table-column>
        <el-table-column align="center" prop="endTime" label="结束时间" width="80"> </el-table-column>
        <el-table-column align="center" prop="time" label="课时"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      courseInfo: [],
      value: '2021-2022    第一学期',
      yearTerms: [],
      courseQuery: {
        year: '',
        term: '',
        deptId: '',
        token: '',
        all: false,
      },
    }
  },
  methods: {
    async getCourseInfo() {
      const { data: res } = await this.$http.post('api/dept/courses', this.qs.stringify(this.courseQuery))
      this.courseInfo = res.data
    },
    yearChange(value) {
      const res = value.split('   ')
      this.courseQuery.year = res[0]
      this.courseQuery.term = res[1]
    },
    async getYearTerm() {
      const { data: res } = await this.$http.post('api/yearTerm')
      if (res.code !== 1020) return this.$message.error('获取学期失败')
      this.yearTerms = res.data.yearTerms
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.courseQuery.token = this.token
    this.courseQuery.deptId = this.userInfo.data.info.deptId
    this.getYearTerm()
    this.getCourseInfo()
  },
  computed: {
    token() {
      return window.sessionStorage.getItem('token')
    },
  },
}
</script>
<style scoped>
.sc_year {
  margin-left: 300px;
  font-size: 14px;
}
</style>