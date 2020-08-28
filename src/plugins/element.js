import Vue from 'vue'
import{
  Message,
  MessageBox
} from 'element-ui'


Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm