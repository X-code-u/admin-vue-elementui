import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
//团队开发单独拉取，不要全局注册ElementUI
// import './plugins/element'
Vue.use(ElementUI) //使用elementUI
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截
axios.interceptors.request.use(config => {
  //为请求头对象，添加Authorization字段保存token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //不论如何使用都要返回config，拦截后不返回，其他地方不能取到数据会出错
  return config
})

Vue.prototype.$http = axios


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
