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
//导入treetable插件
import TreeTable from 'vue-table-with-tree-grid'
// 调用富文本编辑器
import quillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'

//导入NProgress
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//在request拦截器中展示进度条
//请求拦截
axios.interceptors.request.use(config => {
  NProgress.start()
  //为请求头对象，添加Authorization字段保存token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //不论如何使用都要返回config，拦截后不返回，其他地方不能取到数据会出错
  return config
})
//在 response 拦截器中 隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
//将富文本编辑器注册全局组件
Vue.use(quillEditor)

Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal*1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
