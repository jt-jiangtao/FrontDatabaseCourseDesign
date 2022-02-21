<template>
  <div>
    <el-card>
      <div style="display: flex">
        <div style="width: 160px">
          <el-select @change="updateSpecialty" width="200px" v-model="specialtyId" placeholder="请选择专业" size="small">
            <el-option v-for="item in specialtyInfo" :key="item.specialtyId" :value="item.specialtyId" :label="item.specialtyName"> </el-option>
          </el-select>
        </div>
        <div style="width: 120px; margin-left: 20px">
          <el-select @change="sss" v-model="classId" placeholder="请选择班级" size="small">
            <el-option v-for="item in classInfo" :key="item.classId" :value="item.classId" :label="item.number + '班'"> </el-option>
          </el-select>
        </div>
      </div>
      <el-table :data="scoreInfo" border size="small" style="width: 100%; margin-top: 10px">
        <el-table-column align="center" prop="name" label="姓名" width="80"> </el-table-column>
        <el-table-column align="center" prop="studentId" label="学号"> </el-table-column>
        <el-table-column align="center" prop="nowGrade" label="年级"> </el-table-column>

        <!-- <el-table-column v-for="(item, index) in courses" :prop="item.score" :key="index" align="center" :label="item.courseName"> </el-table-column> -->

        <el-table-column align="center" prop="specialtyName" label="专业名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="specialtyName" label="专业名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="specialtyName" label="专业名称" width="80"> </el-table-column>
      </el-table>
    </el-card>
    <el-button @click="getScoreDistribute"></el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: '',
      specialtyId: '',
      specialtyInfo: [],
      classInfo: [],
      classId: '',
      scoreQuery: {
        deptId: '',
        specialtyId: '',
        year: '',
        term: '',
        all: '',
        grade: '',
        classId: '',
      },
      scoreInfo: [],
      courses: [],
    }
  },
  methods: {
    sss() {
      console.log(this.classId)
    },
    //   专业信息
    async getspecialtyInfo() {
      const { data: res } = await this.$http.post(
        'api/dept/specialty',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
        })
      )
      this.specialtyInfo = res.data
    },
    // 班级信息
    async getClassInfo() {
      const { data: res } = await this.$http.post(
        'api/dept/class',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.specialtyId,
        })
      )
      this.classInfo = res.data
      console.log(this.classId)
    },
    //成绩分布
    async getScoreDistribute() {
      const { data: res } = await this.$http.post(
        'api/dept/distribute',
        this.qs.stringify({
          token: this.token,
          deptId: this.userInfo.data.info.deptId,
          //   classId: this.classId,
        })
      )
      console.log(res)
      this.scoreInfo = res.data
      this.courses = res.data[1].courses
      console.log(this.courses)
    },
    updateSpecialty() {
      this.getClassInfo()
      //   this.classId = this.classId
      //   console.log(this.classId)
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.scoreQuery.deptId = this.userInfo.data.info.deptId
    this.scoreQuery.specialtyId = this.specialtyId
    this.scoreQuery.classId = this.classId
    this.getspecialtyInfo()
    this.getScoreDistribute()
  },
  computed: {
    token() {
      return window.sessionStorage.getItem('token')
    },
  },
}
</script>
<style scoped>
</style>