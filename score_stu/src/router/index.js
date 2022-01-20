import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Score from "../components/score/Score.vue"
import Welcome from "../components/Welcome.vue"
import Grade from "../components/score/Grade.vue"
import Personal from "../components/personal/Personal.vue"
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home,
    redirect: '/welcome',
    children: [
      { path: '/score', component: Score },
      { path: '/welcome', component: Welcome },
      { path: '/personal', component: Personal },
      { path: '/gpa', component: Grade },

    ]
  },

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问 from 从那个路径跳转而来 next()放行 next('/login)强制跳转
  // 如果用户访问登陆页面，直接放行
  if (to.path === '/login') return next()
  // 从sessionStorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})
export default router
