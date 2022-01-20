import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue"

Vue.use(VueRouter)

const routes = [

  { path: '/', redirect: '/admin/login' },
  { path: '/admin/login', component: Login },

]

const router = new VueRouter({
  routes
})

export default router
