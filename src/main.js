import { createApp } from 'vue'
import './style.css'
import './style/index.css'
import {createRouter, createWebHashHistory} from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import EnterData from './views/EnterData.vue'
import Home from './views/Home.vue'
import Winners from './views/Winners.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/enterdata', component: EnterData },
  { path: '/winners', component: Winners }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

import App from './App.vue'

createApp(App).use(router).use(ElementPlus).mount('#app')
