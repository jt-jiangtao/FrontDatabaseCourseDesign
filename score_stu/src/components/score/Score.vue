<template>
  <div>
    <el-card class="box-card">
      <div style="display: flex">
        <div class="sc_year">
          <span class="sc_text">学期学年 : </span>
          <el-select v-model="value" placeholder="请选择" size="small" @change="yearChange(value)">
            <el-option v-for="item in yearTerms" :key="item.id" :value="item.year + '   ' + item.term"> </el-option>
          </el-select>
        </div>
        <div class="sc_type">
          <span>成绩项目 : </span>
          <el-select v-model="value1" placeholder="请选择" size="small" @change="termChange(value1)">
            <el-option v-for="item in type" :key="item.value" :value="item.label"> </el-option>
          </el-select>
        </div>
        <el-button style="margin-left: 300px" type="primary" size="small" @click="searchScore()">查询</el-button>
      </div>
      <el-table v-show="table1" :data="scoreInfo" border style="width: 100%; margin-top: 10px" size="small">
        <el-table-column prop="courseId" label="课程号" width="100" align="center"> </el-table-column>
        <el-table-column prop="year" label="学年" align="center"> </el-table-column>
        <el-table-column prop="term" label="学期" align="center"> </el-table-column>
        <el-table-column prop="courseName" label="课程名" align="center"> </el-table-column>
        <el-table-column prop="time" label="考核时间" align="center"> </el-table-column>
        <el-table-column prop="name" label="考核类型" width="180" align="center"> </el-table-column>
        <el-table-column prop="score" label="考核成绩" width="180" align="center"> </el-table-column>
      </el-table>

      <!-- 最终成绩 -->
      <el-table v-show="table2" :data="finalScore" border style="width: 100%; margin-top: 10px" size="small">
        <el-table-column prop="courseId" label="课程号" width="100" align="center"> </el-table-column>
        <el-table-column prop="year" label="学年" align="center"> </el-table-column>
        <el-table-column prop="term" label="学期" align="center"> </el-table-column>
        <el-table-column prop="courseName" label="课程名" align="center"> </el-table-column>
        <el-table-column prop="property" label="课程类型" align="center"> </el-table-column>
        <el-table-column prop="studyMode" label="修读方式" align="center"> </el-table-column>
        <el-table-column prop="score" label="学分" width="180" align="center"> </el-table-column>
        <el-table-column prop="grade" label="成绩" width="180" align="center"> </el-table-column>
        <el-table-column prop="r" label="班级排名" width="180" align="center"> </el-table-column>
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
      table1: true,
      table2: false,
      //查询参数
      scoreQuery: {
        token: this.token,
        studentId: this.studentId,
        year: '',
        term: '',
        type: '',
        all: false,
      },
      yearTerms: [],
      type: [
        {
          value: 'ORDINARY',
          label: '平时成绩',
        },
        {
          value: 'COMPOSITION',
          label: '原始成绩',
        },
      ],
      cascaderProps: {
        expandTrigger: 'hover',
      },
      //选中的学期学年的值
      value: '',
      //选中的考核类型的值
      value1: '',
      //平时成绩信息
      scoreInfo: [],
      //最终成绩信息
      finalScore: [],
    }
  },
  methods: {
    //查询成绩
    async searchScore() {
      // console.log(this.scoreQuery);

      const { data: res } = await this.$http.post('api/student/score', this.qs.stringify(this.scoreQuery))
      if (res.code !== 1020) return this.$message.error('查询成绩失败')
      if (this.scoreQuery.type === '' || 'ORDINARY') {
        this.scoreInfo = res.data
        this.table1 = true
        this.table2 = false
      }
      if (this.scoreQuery.type === 'COMPOSITION') {
        this.finalScore = res.data
        this.table1 = false
        this.table2 = true
      }
      console.log(res.data)
    },
    //获取学年
    async getYearTerm() {
      const { data: res } = await this.$http.post('api/yearTerm')
      if (res.code !== 1020) return this.$message.error('获取学期失败')
      this.yearTerms = res.data.yearTerms
    },
    //当查询学期学年改变时
    yearChange(value) {
      const res = value.split('   ')
      this.scoreQuery.year = res[0]
      this.scoreQuery.term = res[1]
    },
    //当查询考核项目改变时
    termChange(value1) {
      if (value1 === '平时成绩') {
        this.scoreQuery.type = 'ORDINARY'
      }
      if (value1 === '原始成绩') {
        this.scoreQuery.type = 'COMPOSITION'
      }
    },
  },
  created() {
    this.scoreQuery.token = this.token
    this.scoreQuery.studentId = this.studentId
    this.getYearTerm()
    this.searchScore()
  },
  computed: {
    studentId() {
      return window.sessionStorage.getItem('studentId')
    },
    token() {
      return window.sessionStorage.getItem('token')
    },
  },
}
</script>