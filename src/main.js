// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import vueEcharts from 'vue-echarts'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.$vueEcharts = vueEcharts
Vue.component('vue-echarts', vueEcharts)
const chinaMap = require('echarts/map/json/china')
vueEcharts.registerMap('china', chinaMap)

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
