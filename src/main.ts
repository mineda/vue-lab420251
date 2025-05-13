import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import axios from 'axios'
import { loginStore } from './stores/login'

axios.defaults.baseURL = 'https://supreme-disco-jp5v55p55w2p44p-8080.app.github.dev/'

axios.interceptors.request.use((config) => {
  const store = loginStore()
  if (store.token) {
    config.headers.Authorization = store.token
  }
  return config
})

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')
