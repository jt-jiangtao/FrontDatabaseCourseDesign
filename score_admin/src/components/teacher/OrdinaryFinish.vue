<template>
  <div>
    <el-card>
      <el-select v-model="CourseValue" placeholder="请选择" size="small">
        <el-option v-for="item in className" :key="item.id" :value="item.id" :label="item.name"> </el-option>
      </el-select>
      <el-button type="primary" size="small" class="btn" @click="getClass" style="margin-left: 20px">查询</el-button>

      <!--未录入表格内容 -->
      <el-table :data="finish" style="width: 100%; margin-top: 10px" border stripe size="small">
        <el-table-column align="center" prop="studentName" label="学生姓名" width="80"> </el-table-column>
        <el-table-column align="center" prop="studentId" label="学号"> </el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="year" label="学年"> </el-table-column>
        <el-table-column align="center" prop="term" label="学期" width="100"> </el-table-column>
        <el-table-column align="center" prop="typeName" label="考核名称" width="80"> </el-table-column>
        <el-table-column align="center" prop="proportionInOrdinary" label="在平时成绩中占比" width="80"> </el-table-column>
        <el-table-column align="center" prop="proportionInCourse" label="在课程占比" width="80"> </el-table-column>
        <el-table-column align="center" prop="score" label="分数" width="80"> </el-table-column>
        <el-table-column label="操作" width="175" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="addScore(scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeScore(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- Execl对话框 -->
    <el-dialog title="上传Execl文件" :visible.sync="ExeclDialog" width="30%">
      <el-upload :on-change="onUploadChange" ref="upload" on :file-list="fileList" :auto-upload="false" class="upload-demo" drag action="">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">上传Excel格式文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ExeclDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分数对话框 -->
    <!-- 修改成绩对话框 -->
    <el-dialog title="增加成绩" :visible.sync="addScoreDialog" width="30%" @close="addScoreDialogeClose()">
      <el-form :model="addScoreForm" :rules="addScoreRules" ref="addScoreRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="课程名称">
          <el-input v-model="addScoreForm.courseName" disabled></el-input>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="addScoreForm.studentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="学生学号">
          <el-input v-model="addScoreForm.studentId" disabled></el-input>
        </el-form-item>
        <el-form-item label="学生成绩" prop="score">
          <el-input v-model="addScoreForm.score" type="number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addScoreDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddScore">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //上传的文件数组
      fileList: [],
      //上传的文件
      file: undefined,
      userInfo: {},
      ExeclDialog: false,
      CourseValue: 1,
      yearTerms: [],
      classQuery: {
        token: '',
        teacherId: '',
        year: '',
        term: '',
      },
      //课程信息
      className: [],
      //成绩信息
      undo: [],
      finish: [],
      //添加成绩表单
      addScoreForm: {
        courseName: '',
        studentName: '',
        studentId: '',
        score: '',
      },
      //控制添加成绩对话框关闭
      addScoreDialog: false,
      //增家成绩表单验证规则
      addScoreRules: {
        score: [{ required: true, message: '请输入学生成绩', trigger: 'blur' }],
      },
    }
  },
  methods: {
    //平时成绩查看
    async getGrade() {
      const { data: res } = await this.$http.post(
        'api/teacher/normalScore/get',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      console.log(res)
      this.undo = res.data.undo

      this.finish = res.data.finish
    },
    //上传Execl
    async UploadExecl() {
      if (this.CourseValue === '') {
        return this.$message.warning('请先选择课程')
      }
      this.ExeclDialog = true
    },
    //获取上传文件
    onUploadChange(file, fileList) {
      // 获取上传的文件
      this.fileList = fileList
      console.log(this.fileList)
    },
    //确定上传
    async submitUpload() {
      // https://api.jiangtao.website/api/teacher/examScore/upload/excel
      // this.qs.stringify({
      //     courseId: this.CourseValue,
      //     teacherId: this.userInfo.data.info.teacherId,
      //     token: this.token,
      //     file: this.fileList.raw,
      //   })
      var param = new FormData()
      this.fileList.forEach((val) => {
        param.append('file', val.raw)
      })
      param.append('courseId', this.CourseValue)
      param.append('teacherId', this.userInfo.data.info.teacherId)
      param.append('token', this.token)
      const { data: res } = await this.$http.post('api/teacher/examScore/upload/excel', param, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log(res)
      if (res.code !== 1020) {
        return this.$message.error('上传失败')
      }
      this.$message.success('上传成功')
      this.ExeclDialog = false
      this.getGrade()
      // this.$message.success('上传成功')
    },
    //下载Execl模板
    async downloadExecl() {
      const response = await this.$http.post(
        'api/teacher/normalScore/download/excel',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        }),
        {
          responseType: 'blob',
        }
      )
      console.log(response)

      this.exportFile(response)
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
          window.navigator.msSaveBlob(blob, '平时成绩表.xls')
        } catch (e) {
          console.log(e)
        }
      } else {
        //非IE
        var link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '平时成绩表.xls')
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
      this.getGrade()
    },

    //当查询学期学年改变时
    // yearChange(value) {
    //   const res = value.split("   ");
    //   this.classQuery.year = res[0];
    //   this.classQuery.term = res[1];
    // },

    //点击打开添加成绩对话框
    addScore(row) {
      console.log(row)

      this.addScoreForm.courseName = row.courseName
      this.addScoreForm.studentName = row.studentName
      this.addScoreForm.studentId = row.studentId

      this.addScoreDialog = true
    },
    //关闭添加对话框清空表单
    addScoreDialogeClose() {
      this.$refs.addScoreRef.resetFields()
    },
    //点击确认添加成绩
    confirmAddScore() {
      this.$refs.addScoreRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'api/teacher/examScore/add',
          this.qs.stringify({
            items: '[{' + 'score' + ':' + this.addScoreForm.score + ',' + 'studentId' + ': ' + this.addScoreForm.studentId + '}]',
            courseId: this.CourseValue,
            teacherId: this.userInfo.data.info.teacherId,
            token: this.token,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
          }
        )
        console.log(res)
        if (res.code !== 1020) {
          return this.$message.error(res.message)
        }
        this.$message.success(res.message)
        this.addScoreDialog = false
        //跟新考试成绩表格
        this.getGrade()
      })
    },
    async removeScore(row) {
      console.log(row)
      //弹框提示窗
      const confirmResult = await this.$confirm('此操作将永久删除学生已录入成绩, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      //用户确认删除则，confirmResult为字符串 confirm
      //用户确认删除则，confirmResult为字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.post(
        'api/teacher/normalScore/delete',
        this.qs.stringify({
          studentOrdinaryScoreId: '[' + row.studentOrdinaryScoreItemId + ']',
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        }
      )

      console.log(res)
      if (res.code !== 1020) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getGrade()
    },
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