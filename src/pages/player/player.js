import { createApp } from 'vue'
import router from '@/router'
import App from './app.vue'
import '@/style/index.scss'
import ElementPlus from 'element-plus';
import locale from '@/script/zh-cn.js'
createApp(App).use(router).use(ElementPlus,{locale}).mount('#app')
