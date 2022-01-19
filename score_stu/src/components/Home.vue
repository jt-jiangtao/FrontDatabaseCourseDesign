<template>
  <div>
    <el-container>
      <el-header class="header">
        <el-menu router :default-active="activeIndex" class="el-menu-demo" unique-opened>
          <el-menu-item index="score">成绩查询</el-menu-item>
          <el-menu-item index="gpa">绩点查询</el-menu-item>
          <el-menu-item index="personal">个人中心</el-menu-item>
        </el-menu>
        <div class="time">
          <i class="el-icon-switch-button" style="position: absolute; left: 94%; top: 10px"></i>
          <el-button type="text" style="position: absolute; color: black; font-size: 12px; top: -3px; left: 95.4%" @click="logout">退出系统</el-button>
          <span>{{ userInfo.time }} </span>
          <span> {{ userInfo.data.info.name }}</span>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.el-menu-item {
  width: 350px;
}
.time {
  padding-top: 30px;
  font-size: 12px;
}
.el-menu-demo {
  border-right: 0;
  width: 1300px;
  display: flex;
  justify-content: center;
}
</style>
<script>
export default {
  data() {
    return {
      activeIndex: '',
      loginFrom: {
        username: '',
        password: '',
      },
      userInfo: {},
    }
  },
  computed: {},
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async login() {
      const { data: res } = await this.$http.post('api/login', this.qs.stringify(this.loginFrom))
      this.userInfo = res
      const temp = this.userInfo.time.split(' ')
      this.userInfo.time = temp[0]
      // console.log(this.userInfo);
    },
  },
  created() {
    this.loginFrom.username = window.sessionStorage.getItem('studentId')
    this.loginFrom.password = window.sessionStorage.getItem('psd')
    this.login()
  },
}
</script>