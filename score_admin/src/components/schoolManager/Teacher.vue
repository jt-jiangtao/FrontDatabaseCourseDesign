<template>
  <div>
    <el-card>
      <el-table :data="teacherInfo" border size="small" style="width: 100%; margin-top: 10px">
        <el-table-column align="center" prop="name" label="教师名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="professionalTitle" label="职称"> </el-table-column>
        <el-table-column align="center" prop="birthday" label="生日"> </el-table-column>
        <el-table-column align="center" prop="educationBackground" label="毕业院校"> </el-table-column>
        <el-table-column align="center" prop="deptName" label="学院名称"> </el-table-column>
        <el-table-column align="center" prop="entryTime" label="入职时间"> </el-table-column>
        <el-table-column align="center" prop="identityNumber" label="身份证号码" width="180"> </el-table-column>
        <el-table-column align="center" prop="specialtyName" label="专业名称" width="80"> </el-table-column>
      </el-table>
    </el-card>
    <el-button @click="getTeacherInfo"></el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: '',
      teacherInfo: [],
    }
  },
  methods: {
    //获取教师信息
    async getTeacherInfo() {
      const { data: res } = await this.$http.post(
        'api/dept/teacher',
        this.qs.stringify({
          deptId: this.userInfo.data.info.deptId,
          specialtyId: this.userInfo.data.info.specialtyId,
          token: this.token,
        })
      )

      this.teacherInfo = res.data
    },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.getTeacherInfo()
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