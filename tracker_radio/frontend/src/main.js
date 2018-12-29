// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueGtm from 'vue-gtm'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '../node_modules/firebaseui/dist/firebaseui.css'
import App from './App'
import router from './router'
import firebase from 'firebase/app'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  iconfont: 'md'
})
Vue.use(VueGtm, {
  id: 'GTM-5QXM7D3',
  enabled: true,
  debug: true,
  vueRouter: router
})

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyBpiuyGfSBMAUKFOKEce-oEWDAvvf5sGTE',
  authDomain: 'trackerradio.firebaseapp.com',
  databaseURL: 'https://trackerradio.firebaseio.com',
  projectId: 'trackerradio',
  storageBucket: 'trackerradio.appspot.com',
  messagingSenderId: '688829133193'
}

firebase.initializeApp(config)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
