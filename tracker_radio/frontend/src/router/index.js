import Vue from 'vue'
import Router from 'vue-router'

const routerOptions = [
  { path: '/', component: 'Home' },
  { path: '/artists', component: 'Artists' },
  { path: '/artists/:id', component: 'Artist' },
  { path: '/login', component: 'Login' },
  { path: '/sign-up', component: 'SignUp' },
  { name: 'track', path: '/tracks/:id', component: 'Track' },
  { path: '/playlists', component: 'Playlists' },
  { path: '/playlists/:id', component: 'Playlist' },
  { path: '/autoplaylists/:id', component: 'AutoPlaylist' }
]

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/components/${route.component}.vue`)
  }
})

Vue.use(Router)

export default new Router({
  routes,
  mode: 'history'
})
