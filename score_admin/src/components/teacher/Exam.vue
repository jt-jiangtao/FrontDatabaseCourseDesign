<template>
  <div>
    <el-card>
      <el-select v-model="CourseValue" placeholder="请选择" size="small">
        <el-option v-for="item in className" :key="item.id" :value="item.id" :label="item.name"> </el-option>
      </el-select>
      <el-button type="primary" size="small" class="btn" @click="getClass">查询</el-button>
      <el-button type="success" size="small" class="btn" @click="downloadExecl">上传execl文件</el-button>
      <el-button type="warning" size="small" class="btn">上传sql文件</el-button>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},

      CourseValue: '',
      yearTerms: [],
      classQuery: {
        token: '',
        teacherId: '',
        year: '',
        term: '',
      },
      //班级信息
      className: [],
    }
  },
  methods: {
    //下载Execl模板
    async downloadExecl() {
      const response = await this.$http.post(
        'api/teacher/examScore/download/excel',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', //请求的数据类型为form data格式
          },
          responseType: 'blob',
        }
      )
      console.log(response)
      //   if (response.status == 200) {
      this.exportFile(response)
      //   let r = new FileReader();
      //   r.readAsText(response.data); // FileReader的API
      //   } else {
      //     this.$message({
      //       message: "服务器错误",
      //       type: "error",
      //       duration: 2000,
      //     });
      //   }
    },
    // 处理下载文件
    exportFile(result) {
      //   var contentDisposition = result.headers["content-disposition"];
      //   // 这里后端给的内容中，文件名字可能是驼峰式名称的 fileName ，或者是全部小写的 filename
      //   var filename = contentDisposition.split("=")[1];
      // 注意这里的 result.data ，如果只传 result 的话，最后下载出来的excel文件，里面显示的是 [object Object]
      //   var blob = new Blob([result.data], {
      //     type: result.headers["content-type"] + ";charset=UTF-8",
      //   });
      // let blob = new Blob([result.data],{type: "application/x-msdownload;charset=GBK"});
      //   let blob = new Blob([result.data], { type: 'application/x-msdownload' })
      //   let blob = new Blob([result.data])
      let blob = new Blob([result.data], {
        type: 'application/vnd.ms-excel',
      })
      var url = URL.createObjectURL(blob)
      if (window.navigator.msSaveBlob) {
        //IE
        try {
          window.navigator.msSaveBlob(blob, '期末成绩表.xls')
        } catch (e) {
          console.log(e)
        }
      } else {
        //非IE
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '期末成绩表.xls')
        document.body.appendChild(link)
        link.click()
      }

      URL.revokeObjectURL(url) // 释放内存
      document.body.removeChild(link)
    },
    //获取学年
    async getYearTerm() {
      const { data: res } = await this.$http.post('api/yearTerm')
      if (res.code !== 1020) return this.$message.error('获取学期失败')
      this.yearTerms = res.data.yearTerms
    },
    // 获取所带班级
    async getClass() {
      const { data: res } = await this.$http.post('api/teacher/course', this.qs.stringify(this.classQuery))
      this.className = res.data.courses
    },

    //当查询学期学年改变时
    // yearChange(value) {
    //   const res = value.split("   ");
    //   this.classQuery.year = res[0];
    //   this.classQuery.term = res[1];
    // },
  },
  created() {
    this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    this.classQuery.token = this.token
    this.classQuery.teacherId = this.userInfo.data.info.teacherId
    this.getYearTerm()
    this.getClass()
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