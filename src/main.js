// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueRx from 'vue-rx'
import Rx from 'rxjs/Rx'
import './util/rem'
import axios from 'axios'
// import Mint from 'mint-ui';
// import 'mint-ui/lib/style.css';
// Vue.use(Mint);
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRx, Rx)
Vue.prototype.$axios = axios
// Vue.component('custom-input', () => {
//   return new Promise((resolve, reject) => {
//     axios.get('http://localhost:8888/customInput.vue').then(res => {
//       console.log(res.data)
//       resolve(res.data)
//     })
//   })
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
