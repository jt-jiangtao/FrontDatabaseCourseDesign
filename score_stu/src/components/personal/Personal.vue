<template>
  <div style="display: flex">
    <div class="avatar">
      <el-card>
        <div class="avatar_item">
          <el-avatar style="margin-bottom: 10px" :size="100">
            {{ userInfo.data.info.name }}
          </el-avatar>
          <span style="margin-top: 20px">{{ userInfo.data.info.studentId }}</span>
          <el-button style="margin-top: 320px" type="text" @click="showChangeCodeDialog">修改密码</el-button>
        </div>
      </el-card>
    </div>
    <div class="pri_info">
      <el-card>
        <div class="description">
          <el-descriptions :column="2" size="medium" border>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                姓名
              </template>
              {{ userInfo.data.info.name }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                性别
              </template>
              {{ userInfo.data.info.sex }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>
                学号
              </template>
              {{ userInfo.data.info.studentId }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                学院
              </template>
              <el-tag size="small">{{ userInfo.data.info.deptName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                专业
              </template>
              {{ userInfo.data.info.specialtyName }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>
                班级号
              </template>
              {{ userInfo.data.info.classNumber }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>
    </div>
    <!-- 修改密码对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="35%" @close="handleClose()">
      <el-form :rules="codeFormRules" ref="codeForm" :model="codeForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="codeForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="password">
          <el-input v-model="codeForm.password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="codeForm.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChangeCode">取 消</el-button>
        <el-button type="primary" @click="confirmChangeCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //控制对话框
      dialogVisible: false,
      //密码表单
      codeForm: {
        username: window.sessionStorage.getItem('studentId'),
        password: '',
        newPassword: '',
      },
      loginFrom: {
        username: '',
        password: '',
      },
      userInfo: {},
      //修改密码表单验证规则
      codeFormRules: {
        password: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在6~18个字符之间', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async login() {
      const { data: res } = await this.$http.post('api/login', this.qs.stringify(this.loginFrom))
      this.userInfo = res
      const temp = this.userInfo.time.split(' ')
      this.userInfo.time = temp[0]
      console.log(this.userInfo)
    },
    //点击展示修改密码对话框
    showChangeCodeDialog() {
      this.dialogVisible = true
    },
    //修改密码对话框关闭事件
    handleClose() {
      this.$refs.codeForm.resetFields()
    },
    //点击确认修改密码
    confirmChangeCode() {
      this.$refs.codeForm.validate(async (valid) => {
        if (!valid) return
        //发起添加用户的网络请求
        const { data: res } = await this.$http.post('api/bank/update', this.qs.stringify(this.codeForm))
        if (res.code !== 1020) {
          return this.$message.error(res.message)
        }
        this.$message.success('修改密码成功')
        this.dialogVisible = false
      })
    },
    //点击取消修改密码
    cancelChangeCode() {
      this.dialogVisible = false
    },
  },
  created() {
    this.loginFrom.username = window.sessionStorage.getItem('studentId')
    this.loginFrom.password = window.sessionStorage.getItem('psd')
    this.login()
  },
}
</script>
<style >
.description {
  margin-top: 40px;
  margin-left: 80px;
  width: 800px;
  /* display: inline-block; */
}
.el-dialog__body {
  padding: 15px 20px !important;
}
.el-card__body {
  height: 550px;
}
</style>
<style scoped>
.description {
  align-content: center;
}
.pri_info {
  width: 1000px;
  margin-left: 40px;
}
.avatar {
  margin-left: 120px;
  width: 230px;
  height: 100%;
}
.avatar_item {
  height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>