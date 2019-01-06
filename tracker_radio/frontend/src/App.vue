<template>
  <v-app id="app">
    <v-toolbar dark fixed app color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Tracker Radio</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/artists">Artists</v-btn>
        <v-tooltip bottom v-if="user == null">
          <v-btn slot="activator" flat>Playlists</v-btn>
          <span>Login/Sign Up to use Playlists</span>
        </v-tooltip>
        <v-btn flat v-if="user != null" to="/playlists">Playlists</v-btn>
        <v-btn flat to="/tracks/popular">Popular Tracks</v-btn>
        <v-btn flat v-on:click="onRandomTrack()">Random Track</v-btn>
        <v-btn flat v-if="user == null" to="/login">Login/Sign Up</v-btn>
      </v-toolbar-items>
      <v-menu v-if="user != null" offset-y>
        <v-btn icon slot="activator">
          <v-avatar color="white" size="40">
            <v-img :src="user.photoURL"></v-img>
          </v-avatar>
        </v-btn>
        <v-list>
          <v-list-tile v-if="user != null" v-on:click="logout">
            Logout
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content id="page">
      <router-view :user="user"
        v-on:track-selected="selectedTrackId = $event"
        v-on:play-track="playingTrackId = $event">
      </router-view>
    </v-content>
    <v-footer app fixed height="128" class="raised-footer">
      <TrackPlayer v-bind:user="user" v-bind:trackId="playingTrackId"></TrackPlayer>
    </v-footer>
    <div id="feedback-button" v-on:click="feedbackModalShow = true">
      Feedback
    </div>
    <!-- Feedback Modal -->
    <v-dialog
      ref="feedbackModal"
      id="modal1"
      title="Your Feedback is Welcome"
      max-width="600px"
      v-model="feedbackModalShow">
      <v-card>
        <v-card-title>
          <span class="headline">Your Feedback is Welcome</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex md6>
                <v-text-field
                  id="feedbackEmailInput"
                  v-model="feedbackEmail"
                  :rules="[rules.required, rules.email]"
                  label="Email">
                </v-text-field>
              </v-flex>
              <v-flex md12>
                <v-textarea
                  v-model="feedbackContent"
                  id="feedbackContentTextArea"
                  label="Enter your comments">
                </v-textarea>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"
                 flat v-on:click="feedbackModalShow = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1"
                 flat v-on:click="onSubmitFeedback">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'

import TrackPlayer from './components/TrackPlayer.vue'

export default {
  name: 'App',
  data () {
    return {
      user: null,
      feedbackEmail: '',
      feedbackContent: '',
      selectedTrackId: null,
      playingTrackId: null,
      feedbackModalShow: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  components: {
    TrackPlayer
  },
  mounted: function () {
    var self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.user = user
        self.feedbackEmail = user.email
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
        self.feedbackEmail = ''
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
    },
    onSubmitFeedback (evt) {
      evt.preventDefault()
      const path = process.env.API_BASE_URL + `api/feedback`
      const user = firebase.auth().currentUser
      if (user) {
        var self = this
        user.getIdToken(true).then(function (idToken) {
          axios.post(path, {
            email: self.feedbackEmail,
            content: self.feedbackContent
          }, { headers: { 'Authorization': 'bearer ' + idToken } }).then(function (response) {
            console.log(response)
            self.feedbackModalShow = false
          })
        })
      } else {
        axios.post(path, {
          email: this.feedbackEmail,
          content: this.feedbackContent
        }).then(function (response) {
          console.log(response)
          self.feedbackModalShow = false
        })
      }
    },
    onResetFeedback (evt) {
      evt.preventDefault()
      this.feedbackEmail = ''
      this.feedbackContent = ''
    },
    onRandomTrack () {
      const path = process.env.API_BASE_URL + `api/tracks/random`
      const user = firebase.auth().currentUser
      if (user) {
        var self = this
        user.getIdToken(true).then(function (idToken) {
          axios.get(path,
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.$router.push({ name: 'track', params: { id: response.data.id } })
            })
        })
      } else {
        axios.get(path)
          .then(function (response) {
            this.$router.push({ name: 'track', params: { id: response.data.id } })
          })
      }
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
  background-color: white;
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
  position: relative;
}

#page {
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  min-height: 0;
}
.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
}
#feedback-button {
  position: fixed;
  right: 0;
  top: 50%;
  transform: rotate(270deg);
  transform-origin: right bottom;
  background-color: white;
  border: 1px solid black;
  color: black;
  padding: 5px 5px 0 5px;
  border-radius: 5px 5px 0 0;
}
.raised-footer {
  box-shadow: 0 -2px 4px -1px rgba(0,0,0,.2),
              0 -4px 5px 0 rgba(0,0,0,.14),
              0 -1px 10px 0 rgba(0,0,0,.12);
}
</style>
