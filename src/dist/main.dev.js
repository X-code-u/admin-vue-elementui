"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

var _elementUi = _interopRequireDefault(require("element-ui"));

require("element-ui/lib/theme-chalk/index.css");

require("./assets/css/global.css");

require("./assets/fonts/iconfont.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//element-ui的全部组件
//element-ui的css
//团队开发单独拉取，不要全局注册ElementUI
// import './plugins/element'
_vue["default"].use(_elementUi["default"]); //使用elementUI


//配置请求的根路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'; //请求拦截

_axios["default"].interceptors.request.use(function (config) {
  //为请求头对象，添加Authorization字段保存token
  config.headers.Authorization = window.sessionStorage.getItem('token'); //不论如何使用都要返回config，拦截后不返回，其他地方不能取到数据会出错

  return config;
});

_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');