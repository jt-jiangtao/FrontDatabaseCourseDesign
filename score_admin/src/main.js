import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import ElementUI from 'element-ui'


Vue.config.productionTip = false
Vue.use(ElementUI)


axios.defaults.baseURL = 'https://api.jiangtao.website/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.qs = qs;
Vue.prototype.$http = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')




