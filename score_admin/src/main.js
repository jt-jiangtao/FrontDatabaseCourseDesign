import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'
import "./assets/css/index.css"
import * as echarts from 'echarts';

Vue.prototype.$echarts = echarts





Vue.config.productionTip = false
Vue.use(ElementUI)

axios.defaults.baseURL = '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//axios请求拦截器
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   //最后必须返回config
//   return config
// })
// Vue.filter('dateFormat', function (originVal) {
//   const newDate = new Date(originVal)
//   const y = newDate.getFullYear()
//   const m = (newDate.getMonth() + 1 + '').padStart(2, '0')
//   const d = (newDate.getDate() + '').padStart(2, '0')
//   return `${y}-${m}-${d}`
// })
Vue.prototype.qs = qs;
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')




