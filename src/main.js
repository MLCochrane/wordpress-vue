// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import store from "./store";
import './sass/app.scss';
import './filters';


Vue.config.productionTip = false;

// Allows the use of 'this.$http' as vue-resrouce
Vue.prototype.$http = axios;

Vue.prototype.$eventHub = new Vue(); // Global event bus
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
