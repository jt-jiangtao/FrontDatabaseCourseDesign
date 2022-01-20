import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
import './plugins/element.js'
import qs from 'qs'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Vue.prototype.axios = axios.create({
//   headers: {'content-type': 'application/x-www-form-urlencoded'}
// });
Vue.prototype.qs = qs;
Vue.prototype.$http = axios
//配置请求根路径
axios.defaults.baseURL = 'https://api.jiangtao.website/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

//组件传值用
Vue.prototype.bus = new Vue()

import { Message } from 'element-ui';

Vue.prototype.$message = function (msg) {
  Message(msg)
}
Vue.prototype.$message = function (msg) {
  return Message({
    message: msg,
    duration: 2000
  })

}
Vue.prototype.$message.success = function (msg) {
  return Message.success({
    message: msg,
    duration: 1000
  })
}
Vue.prototype.$message.warning = function (msg) {
  return Message.warning({
    message: msg,
    duration: 1000
  })
}
Vue.prototype.$message.error = function (msg) {
  return Message.error({
    message: msg,
    duration: 1000
  })
}

