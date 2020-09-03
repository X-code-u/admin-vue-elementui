import Vue from 'vue'
import VueRouter from 'vue-router'

//import Login from '../views/login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../views/login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../views/home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../views/welcome.vue')
//import Home from '../views/home.vue'
//import Welcome from '../views/welcome.vue'

const User = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../views/user/user.vue')
const Rights = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../views/power/rights.vue')
const Roles = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../views/power/roles.vue')
//import User from '../views/user/user.vue'
//import Rights from '../views/power/rights.vue'
//import Roles from '../views/power/roles.vue'

const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../views/goods/cate.vue')
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '../views/goods/params.vue')
// import Cate from '../views/goods/cate.vue'
// import Params from '../views/goods/params.vue'

const List = () => import(/* webpackChunkName:"List_Add" */ '../views/goods/list.vue')
const Add = () => import(/* webpackChunkName:"List_Add" */ '../views/goods/add.vue')
// import List from '../views/goods/list.vue'
// import Add from '../views/goods/add.vue'

const Order = () => import(/* webpackChunkName:"Order_Report" */ '../views/order/order.vue')
const Report = () => import(/* webpackChunkName:"Order_Report" */ '../views/report/report.vue')
// import Order from '../views/order/order.vue'
// import Report from '../views/report/report.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
  //to 
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})

export default router
