<template>
  <div>
    <el-container>
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <el-menu
          v-show="teacher"
          :collapse-transition="false"
          :collapse="iscollapse"
          unique-opened
          background-color="#304156"
          default-active=""
          text-color="#BFCBD9"
          class="el-menu-vertical-demo"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>班级管理</span>
            </template>
            <el-menu-item index="class">所带班级</el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>平时成绩</span>
            </template>
            <el-menu-item index="ordinary">
              <i class="el-icon-document"></i>
              <span slot="title">未录入成绩</span>
            </el-menu-item>
            <el-menu-item index="ordinaryFinish">
              <i class="el-icon-document"></i>
              <span slot="title">已录入成绩</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>考试成绩</span>
            </template>
            <el-menu-item index="exam">
              <i class="el-icon-document"></i>
              <span slot="title">未录入成绩</span>
            </el-menu-item>
            <el-menu-item index="examFinish">
              <i class="el-icon-document"></i>
              <span slot="title">已录入成绩</span>
            </el-menu-item>
          </el-submenu>

          <el-menu-item index="total">
            <i class="el-icon-setting"></i>
            <span slot="title">成绩汇总</span>
          </el-menu-item>
        </el-menu>

        <!-- 管理员侧边栏 -->
        <el-menu
          v-show="manager"
          :collapse-transition="false"
          :collapse="iscollapse"
          unique-opened
          background-color="#304156"
          default-active=""
          text-color="#BFCBD9"
          class="el-menu-vertical-demo"
          router
        >
          <el-menu-item index="course">
            <i class="el-icon-setting"></i>
            <span slot="title">所开课程</span>
          </el-menu-item>
          <el-menu-item index="teacher">
            <i class="el-icon-menu"></i>
            <span slot="title">教师管理</span>
          </el-menu-item>

          <el-menu-item index="adminClass">
            <i class="el-icon-setting"></i>
            <span slot="title">班级管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <img src="../assets/img/asideBtn.png" @click="isfold" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <!-- <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item> -->
          </el-breadcrumb>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      //菜单是否折起
      iscollapse: false,
      teacher: false,
      manager: false,
    }
  },
  methods: {
    //点击折叠菜单
    isfold() {
      this.iscollapse = !this.iscollapse
    },
  },
  computed: {},
  created() {
    const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
    if (userInfo.data.roleList[0].roleName === 'TEACHER') {
      this.teacher = true
    }
    if (userInfo.data.roleList[0].roleName === 'SCHOOL_MANAGER') {
      this.manager = true
    }
    this.userInfo = userInfo
    console.log(this.userInfo)
  },
}
</script>
<style scoped>
.el-header {
  height: 55px !important;
  padding: 0px 5px !important;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-bottom: 2px solid rgb(245, 242, 242);
}
.el-header > img {
  /* margin-top: 10px; */
  width: 37px;
  height: 35px;
}
.el-aside {
  height: 100vh;
  background-color: rgb(48, 65, 86);
  /* overflow: auto; */
  box-sizing: border-box;
  flex-shrink: 0;
  /* 延迟变化 */
  transition: width 0.2s;
  -webkit-transition: width 0.2s;
  -moz-transition: width 0.2s;
  -webkit-transition: width 0.2s;
  -o-transition: width 0.2s;
}
.el-main {
  background-color: rgb(240, 242, 245);
}
.el-breadcrumb {
  margin-left: 10px;
}
.el-menu {
  border-right: 0px;
}
</style>
