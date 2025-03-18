import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import axios from 'axios'

axios.defaults.baseURL = 'https://congenial-halibut-g9j45gpgq2pp9w-8080.app.github.dev/'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
