import { createApp } from 'vue'
import './style.css'
import './style/index.css'
import {createRouter, createWebHashHistory} from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import EnterData from './views/EnterData.vue'
import Home from './views/Home.vue'
import BioLiveHome from './views/BioLiveHome.vue'
import Winners from './views/Winners.vue'
import Settings from './views/Settings.vue'

const isBiolive = import.meta.env.VITE_MERCHANT_TYPE === 'biolive'

const routes = [
  { path: '/', component: isBiolive ? BioLiveHome : Home },
  { path: '/enterdata', component: EnterData },
  { path: '/winners', component: Winners },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

import App from './App.vue'

createApp(App).use(router).use(ElementPlus).mount('#app')
