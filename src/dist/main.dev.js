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
_vue["default"].use(_elementUi["default"]); //使用elementUI


//配置请求的根路径
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');