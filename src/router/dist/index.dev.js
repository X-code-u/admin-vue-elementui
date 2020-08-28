"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _login = _interopRequireDefault(require("../views/login.vue"));

var _home = _interopRequireDefault(require("../views/home.vue"));

var _welcome = _interopRequireDefault(require("../views/welcome.vue"));

var _user = _interopRequireDefault(require("../views/user/user.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: _login["default"]
}, {
  path: '/home',
  component: _home["default"],
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: _welcome["default"]
  }, {
    path: '/users',
    component: _user["default"]
  }]
}];
var router = new _vueRouter["default"]({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
}); //挂载路由守卫

router.beforeEach(function (to, from, next) {
  //to 
  if (to.path === '/login') return next(); //获取token

  var tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
});
var _default = router;
exports["default"] = _default;