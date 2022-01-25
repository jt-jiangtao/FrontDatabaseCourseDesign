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
      window.sessionStorage.setItem("userInfo", JSON.stringify(res));
      window.sessionStorage.setItem("studentId", res.data.username);
      this.$router.push("/home");
    },
  },
};
</script>
<style scoped>
* {
  font-size: 16px;
  border: 0;
  padding: 0;
  margin: 0;
}
.bgone {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
}

.pic {
  width: 492px;
  height: auto;
  position: absolute;
  top: 173px;
  right: 453px;
  left: 0;
  bottom: 0;
  margin: auto;
  z-index: 99999;
}

.table {
  background-color: #ffffff;
  width: 960px;
  height: 465px;
  position: absolute;
  top: 20%;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
}

.password {
  position: absolute;
  top: 12.8rem;
  right: 4rem;
  display: flex;
}

.btn {
  position: absolute;
  top: 18.5rem;
  right: 3.9rem;
  border: none;
  color: #fff;
  width: 373px;
  text-align: center;
  background-color: #1592ef;
  text-indent: 0rem;
  border-radius: 10px;
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  font-size: 20px;
  height: 50px;
}

.wel {
  width: 960px;
  height: 35px;
  color: #fff;
  font-size: 30px;
  position: absolute;
  top: -7rem;
  text-align: center;
}

.wel1 {
  width: 960px;
  height: 35px;
  color: #fff;
  font-size: 12.38px;
  position: absolute;
  top: -4rem;
  text-align: center;
}

input {
  height: 55px;
  width: 373px;
  text-indent: 55px;
  outline: none;
  background: #eef6fd;
  border-bottom: 2px #d6e7fa solid;
}

.password input {
  border: 0;
}

.user {
  position: absolute;
  top: 7.8rem;
  right: 4rem;
  display: flex;
}

#yonghu img {
  height: 30px;
  position: absolute;
  left: 10px;
  top: 13px;
}
</style>