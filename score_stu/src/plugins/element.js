import Vue from 'vue'
import { Button, Form, FormItem, Input, Message, MessageBox } from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
