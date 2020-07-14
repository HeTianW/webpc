// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import App from './App'
import router from './router'
import Vue from 'vue'
import global from './components/common/Global'
import moment from 'moment'
import 'babel-polyfill'

Vue.config.productionTip = false
Vue.prototype.GLOBAL = global
Vue.prototype.$moment = moment
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
