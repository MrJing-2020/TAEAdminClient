import Vue from 'vue'
import VueRouter from 'vue-router'
var VueResource = require('vue-resource');
//import ElementUI from 'element-ui'
//import 'element-ui/lib/theme-default/index.css'
import { Button, Select } from 'element-ui'
import App from './App.vue'
import Main from './Main.vue'

Vue.use(VueRouter)
Vue.use(VueResource)
//Vue.use(ElementUI)
Vue.use(Button)
Vue.use(Select)

const routes = [
        { path: '/', component: Main},
        { path: '/foo', component: Main},
        { path: '/bar', component: App}
]
// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
        routes // （缩写）相当于 routes: routes
})
new Vue({
        el: '#app',
        // render: h => h(mrjing)
        components: {
                'my-component': Main,
                'my-component1': App
        },
        router
}).$mount('#app')


