// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import {TweenMax, Power3, TimelineLite} from "gsap";


Vue.config.productionTip = false

// Allows the use of 'this.$http' as vue-resrouce
Vue.prototype.$http = axios

// All requests made to same place on wp
axios.defaults.baseURL = 'http://localhost/wp-json'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
