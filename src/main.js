import { createApp } from 'vue'
import { createPinia } from 'pinia'

import DateFormats from './plugins/luxon.js';
import App from './App.vue'
import router from './router'
import io from 'socket.io-client'
import './index.css'

import '@fortawesome/fontawesome-free/css/all.css';
// import store from './stores'
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
const app = createApp(App)
const socket = io("http://localhost:3000")
app.config.globalProperties.$socket = socket
window._socket = socket


const vuetify = createVuetify({
    components,
    directives,
})




app.use(DateFormats);
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.mount('#app')
