import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import Mrjing from './Mrjing.vue'

Vue.use(VueRouter)
Vue.use(ElementUI)

const routes = [
        { path: '/foo', component: Mrjing},
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
                'my-component': Mrjing,
                'my-component1': App
        },
        router
}).$mount('#app')
