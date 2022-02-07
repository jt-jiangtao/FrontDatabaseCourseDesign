import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, Card, Select, Cascader, Option, Table, TableColumn,
    MessageBox, Menu, Container, Header, MenuItem, Tag, Dialog, Aside, Breadcrumb, BreadcrumbItem,
    Submenu, Main, Avatar, Descriptions, DescriptionsItem, MenuItemGroup, Upload,
} from 'element-ui'
Vue.use(Aside)
Vue.use(Upload)
Vue.use(MenuItemGroup)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Tag)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Table)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Avatar)
Vue.use(TableColumn)
Vue.use(Option)
Vue.use(Card)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Button)
Vue.use(Menu)
Vue.use(Container)
Vue.use(Header)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Main)
Vue.use(Input)
Vue.use(FormItem)
Vue.use(Form)
Vue.prototype.$message = Message


Vue.prototype.$confirm = MessageBox.confirm
