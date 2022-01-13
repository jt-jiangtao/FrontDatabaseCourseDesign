import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
import './plugins/element.js'

Vue.prototype.$http = axios
//配置请求根路径
axios.defaults.baseURL = 'https://api.jiangtao.website/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
