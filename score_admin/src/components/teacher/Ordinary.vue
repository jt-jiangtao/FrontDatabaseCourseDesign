<template>
  <div>
    <el-card>
      <el-select v-model="CourseValue" placeholder="请选择" size="small">
        <el-option v-for="item in className" :key="item.id" :value="item.id" :label="item.name"> </el-option>
      </el-select>
      <el-button type="primary" size="small" class="btn" @click="searchGrade" style="margin-left: 20px">查询</el-button>
      <el-button type="primary" size="small" class="btn" @click="showNorDialog" style="margin-left: 240px">平时成绩项</el-button>
      <el-button type="success" size="small" class="btn" @click="UploadExecl" style="margin-left: 360px">上传execl文件 </el-button>
      <el-button type="warning" size="small" class="btn" @click="downloadExecl" style="margin-left: 40px">下载Execl模板</el-button>
      <!--未录入表格内容 -->
      <el-table :data="undo" style="width: 100%; margin-top: 10px" border stripe size="small">
        <el-table-column align="center" prop="studentName" label="学生姓名" width="100"> </el-table-column>
        <el-table-column align="center" prop="studentId" label="学号"> </el-table-column>
        <el-table-column align="center" prop="courseName" label="课程名称" width="100"> </el-table-column>
        <el-table-column align="center" prop="score" label="学分数" width="100"> </el-table-column>
        <el-table-column align="center" prop="ordinaryScoreItemName" label="考核名称" width="100"> </el-table-column>
        <el-table-column align="center" prop="ordinaryScoreItemProportion" label="平时分项占比" width="100"> </el-table-column>
        <el-table-column align="center" prop="ordinaryScoreProportion" label="平时分占比" width="100"> </el-table-column>
        <el-table-column align="center" prop="startTime" label="开课时间" width="100"> </el-table-column>
        <el-table-column align="center" prop="endTime" label="结课时间" width="100"> </el-table-column>
        <el-table-column align="center" prop="studyMode" label="修读方式"> </el-table-column>

        <el-table-column label="操作" width="175" align="center">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="addScore(scope.row)"></el-button>
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
        <el-form-item label="考核名称">
          <el-input v-model="addScoreForm.ordinaryScoreItemName" disabled></el-input>
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
    <!-- 平时成绩项对话框 -->
    <el-drawer title="平时成绩项" :visible.sync="ordinaryItemDialog" size="50%">
      <el-table :data="ordinaryItem" style="width: 100%">
        <el-table-column align="center" label="考核名称" prop="name"> </el-table-column>
        <el-table-column align="center" label="考核时间" prop="time"> </el-table-column>
        <el-table-column align="center" label="在平时成绩总占比" prop="proportion"> </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-button size="mini" @click="addNorItem()">添加平时成绩项</el-button>
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="EditordinaryItem(scope.row)">Edit</el-button>
            <el-button size="mini" type="danger" @click="DeleteordinaryItem(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer title="修改平时成绩项" :append-to-body="true" :visible.sync="innerDrawer">
        <el-form :rules="editFormRules" ref="editFormRef" :model="editItem" label-width="80px">
          <el-form-item label="考核名称" prop="name">
            <el-input style="width: 285px" v-model="editItem.name"></el-input>
          </el-form-item>
          <el-form-item label="考核时间" prop="time">
            <el-col :span="18">
              <el-date-picker type="date" placeholder="选择日期" v-model="editItem.time" style="width: 100%"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="考核占比" prop="proportion">
            <el-slider style="width: 270px; margin-left: 15px" v-model="editItem.proportion" :step="0.1" :max="1"> </el-slider>
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelEdit">取 消</el-button>
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>

      <!-- add -->
      <el-drawer title="增加平时成绩项" :append-to-body="true" :visible.sync="addDrawer">
        <el-form :rules="editFormRules" ref="addFormRef" :model="addItem" label-width="80px">
          <el-form-item label="考核名称" prop="name">
            <el-input style="width: 285px" v-model="addItem.name"></el-input>
          </el-form-item>
          <el-form-item label="考核时间" prop="time">
            <el-col :span="18">
              <el-date-picker @change="sss()" type="date" placeholder="选择日期" v-model="addItem.time" style="width: 100%"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="考核名称" prop="proportion">
            <el-slider style="width: 270px; margin-left: 15px" v-model="addItem.proportion" :step="0.1" :max="1"> </el-slider>
          </el-form-item>
          <!-- ss -->
          <el-form-item v-for="(item, index) in ordinaryItem" :key="index" :label="item.name" prop="proportion">
            <el-slider style="width: 270px; margin-left: 15px" v-model="item.proportion" :step="0.1" :max="1"> </el-slider>
          </el-form-item>

          <el-form-item>
            <el-button @click="cancelAdd">取 消</el-button>
            <el-button type="primary" @click="confirmAdd">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </el-drawer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      editFormRules: {
        name: [{ required: true, message: '请输入考核名称', trigger: 'blur' }],
        time: [{ required: true, message: '请输入考核时间', trigger: 'blur' }],
        proportion: [{ required: true, message: '请输入考核占比', trigger: 'blur' }],
      },
      addItem: {
        name: '',
        time: '',
        proportion: 0,
      },
      addDrawer: false,
      editItem: {
        name: '',
        time: '',
        proportion: '',
      },
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
        ordinaryScoreItemId: '',
      },
      //控制添加成绩对话框关闭
      addScoreDialog: false,
      //增家成绩表单验证规则
      addScoreRules: {
        score: [{ required: true, message: '请输入学生成绩', trigger: 'blur' }],
      },
      ordinaryItemDialog: false,
      ordinaryItem: [],
      innerDrawer: false,
    }
  },
  methods: {
    // 修改平时成绩项
    EditordinaryItem(row) {
      this.innerDrawer = true
      console.log(row)
      this.editItem.name = row.name
      this.editItem.time = row.time
      this.editItem.proportion = row.proportion
    },
    //获取平时成绩项
    async getNormalItem() {
      const { data: res } = await this.$http.post(
        'api/teacher/normalScore/item/get',
        this.qs.stringify({
          courseId: this.CourseValue,
          teacherId: this.userInfo.data.info.teacherId,
          token: this.token,
        })
      )
      console.log(res)
      this.ordinaryItem = res.data
    },

    async showNorDialog() {
      this.getNormalItem()
      this.ordinaryItemDialog = true
    },
    async searchGrade() {
      this.getGrade()
    },
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
      if (this.undo.length === 0 && this.CourseValue !== '') {
        this.$message.warning('暂无未录入成绩')
      }
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
      const { data: res } = await this.$http.post('api/teacher/normalScore/upload/excel', param, {
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
      // this.getGrade()
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
      this.addScoreForm.ordinaryScoreItemName = row.ordinaryScoreItemName
      this.addScoreForm.ordinaryScoreItemId = row.ordianryScoreItemId
      this.addScoreDialog = true
    },
    //关闭添加对话框清空表单
    addScoreDialogeClose() {
      this.$refs.addScoreRef.resetFields()
    },
    //点击确认添加成绩
    confirmAddScore() {
      console.log(this.addScoreForm)
      this.$refs.addScoreRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'api/teacher/normalScore/add',
          this.qs.stringify({
            items:
              '[{' + 'score' + ':' + this.addScoreForm.score + ',' + 'studentId' + ':' + this.addScoreForm.studentId + ',' + 'ordinaryScoreItemId' + ':' + this.addScoreForm.ordinaryScoreItemId + '}]',
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
    addNorItem() {
      console.log(this.ordinaryItem)
      this.addDrawer = true
    },
    cancelAdd() {
      this.addDrawer = false
      this.$message.info('已取消增加')
      this.$refs.addFormRef.resetFields()
    },
    confirmAdd() {
      // console.log(this.ordinaryItem)
      // console.log(this.addItem)

      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        var temp = this.ordinaryItem
        temp.map((item) => {
          delete item.ordinaryScoreId
          delete item.id
        })
        console.log(temp)
        var sum = 0
        temp.map((item) => {
          sum = sum + item.proportion
        })
        sum = sum + this.addItem.proportion
        if (sum < 1 || sum > 1) {
          return this.$message.warning('请将各项占比总和置为1')
        }
        temp.push(this.addItem)
        console.log(temp)
        const { data: res } = await this.$http.post(
          'api/teacher/normalScore/item/update',
          this.qs.stringify({
            items: JSON.stringify(temp),
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
        // this.innerDrawer = false
        if (res.code === 1020) {
          this.$message.success('新增成功')
        }
        if (res.data !== 1020) {
          this.$message.error(res.message)
        }
        this.getNormalItem()
        this.addDrawer = false
      })
    },
    cancelEdit() {
      this.innerDrawer = false
      this.$message.info('已取消修改')

      this.$refs.editFormRef.resetFields()
    },
    confirmEdit() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          'api/teacher/normalScore/item/update',
          this.qs.stringify({
            items: '[{' + 'name' + ':' + "'" + this.editItem.name + "'" + ',' + 'time' + ':' + "'" + this.editItem.time + "'" + ',' + 'proportion' + ':' + "'" + this.editItem.proportion + "'" + '}]',
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
        // this.innerDrawer = false
        if (res.code === 1020) {
          this.$message.success('修改成功')
        }
        this.getNormalItem()
        this.innerDrawer = false
      })
    },
    sss() {
      const y = this.addItem.time.getFullYear()
      const m = (this.addItem.time.getMonth() + 1 + '').padStart(2, '0')
      const d = (this.addItem.time.getDate() + '').padStart(2, '0')
      this.addItem.time = y + '-' + m + '-' + d
    },
    DeleteordinaryItem(row) {
      console.log(row)
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