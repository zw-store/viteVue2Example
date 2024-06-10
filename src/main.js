import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import App from './App.vue'

import '@/assets/styles/tailwind.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import customElementUi from '@/components/element-ui'
Vue.use(customElementUi)

import '@/assets/styles/index.scss'
import 'virtual:svg-icons-register'

import SvgIcon from '@/components/SvgIcon'
import RightToolbar from '@/components/RightToolbar'
Vue.component('SvgIcon', SvgIcon)
Vue.component('RightToolbar', RightToolbar)

Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
