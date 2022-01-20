<template>
  <div>
    <img class="bgone" src="../assets/img/1.jpg" />
    <img class="pic" src="../assets/img/a.png" />

    <div class="table">
      <div class="wel">成绩发布系统管理登录</div>
      <div class="wel1">CHENG JI FA BU XI TONG GUAN LI DENG LU</div>
      <div class="user">
        <div id="yonghu" style=""><img src="../assets/img/yhm.png" /></div>
        <input
          type="text"
          v-model="loginForm.username"
          name=""
          placeholder="用户名"
        />
      </div>
      <div class="password">
        <div id="yonghu"><img src="../assets/img/mm.png" /></div>
        <input
          type="password"
          v-model="loginForm.password"
          name="密码"
          placeholder="●●●●●●"
        />
      </div>
      <input
        class="btn"
        type="button"
        name="登录"
        @click="login"
        value="登录"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "3725001",
        password: "3725001",
      },
    };
  },
  methods: {
    async login() {
      if (this.loginForm.username === "" || this.loginForm.password === "") {
        return this.$message.error("请填写账号密码");
      }
      const { data: res } = await this.$http.post(
        "api/login",
        this.qs.stringify(this.loginForm)
      );
      if (res.code != 1020) return this.$message.error("登陆失败");
      this.$message.success("登陆成功");
      window.sessionStorage.setItem("token", res.data.token);
      window.sessionStorage.setItem("studentId", res.data.username);
    },
  },
};
</script>
<style scoped>
@import "../assets/css/index.css";
</style>