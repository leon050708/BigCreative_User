// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 确保已导入
import App from './App.vue'
import router from './router'
import "./assets/main.css"

const app = createApp(App)
const pinia = createPinia() // 确保已创建

app.use(pinia) // 确保已使用
app.use(router)

app.mount('#app')