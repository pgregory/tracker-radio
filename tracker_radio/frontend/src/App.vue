<template>
  <div id="app">
    <div>
      <b-container>
        <b-navbar toggleable="md" type="dark" variant="dark">
          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
          <b-navbar-brand href="#">Tracker Radio</b-navbar-brand>
          <b-collapse is-nav id="nav_collapse">
            <b-navbar-nav>
              <b-nav-item href="/artists">Artists</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-nav-item v-on:click="logout" v-if="user != null">{{ user ? user.displayName : "Not Logged In" }}</b-nav-item>
                <b-nav-item v-if="user == null" href="/login">Login</b-nav-item>
              </b-nav-form>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </b-container>
    </div>
    <div id="page">
      <router-view :user="user"></router-view>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import firebase from 'firebase'
import axios from 'axios'

export default {
  name: 'App',
  data () {
    return {
      user: null
    }
  },
  mounted: function () {
    var self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.user = user
        user.getIdToken(true).then(function (idToken) {
          const path = process.env.API_BASE_URL + `api/signin`
          axios.post(path, {
            token: idToken
          }, { headers: { 'Authorization': 'bearer ' + idToken } }).then(function (response) {
            console.log(response)
          })
        })
      } else {
        self.user = null
      }
    })
  },
  methods: {
    logout () {
      var self = this
      firebase.auth().signOut().then(function () {
        // Sign-out successful.
        self.user = null
      }, function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style>
html {
  height: 100%;
}
html body {
  height: 100%;
  background-color: black;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#page {
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  min-height: 0;
}
</style>
