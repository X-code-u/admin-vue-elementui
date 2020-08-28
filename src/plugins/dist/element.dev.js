"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _elementUi = require("element-ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].prototype.$message = _elementUi.Message;
_vue["default"].prototype.$confirm = _elementUi.MessageBox.confirm;