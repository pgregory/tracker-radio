<template>
  <v-app id="app">
    <v-toolbar dark fixed app color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Tracker Radio</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat to="/artists">Artists</v-btn>
        <v-btn flat to="/playlists">Playlists</v-btn>
      </v-toolbar-items>
      <v-avatar color="white" size="40">
        <b-img v-if="user" :src="user.photoURL"></b-img>
      </v-avatar>
      <b-tooltip target="playlistsMenu" v-if="user == null">Login/Sign Up to use Playlists</b-tooltip>
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
    <div id="feedback-button" v-b-modal.modal1>
      Feedback
    </div>
    <!-- Feedback Modal -->
    <b-modal ref="feedbackModal" id="modal1" title="Your Feedback is Welcome"
      ok-disabled cancel-disabled>
      <b-form @submit="onSubmitFeedback" @reset="onResetFeedback">
        <b-form-group id="feedbackEmailGroup" label="Email address"
                                              label-for="feedbackEmailInput"
                                              v-if="user == null">
          <b-form-input id="feedbackEmailInput"
            v-model="feedbackEmail"
            type="email"
            placeholder="Enter email"
            required>
          </b-form-input>
        </b-form-group>
        <b-form-group id="feedbackContentGroup" label="Enter your comments"
                                                label-for="feedbackContentTextArea">
          <b-form-textarea id="feedbackContentTextArea"
            v-model="feedbackContent"
            placeholder="Enter your comments"
            :rows="5">
          </b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
      <div slot="modal-footer"></div>
    </b-modal>
  </v-app>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
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
      playingTrackId: null
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
            self.$refs.feedbackModal.hide()
          })
        })
      } else {
        axios.post(path, {
          email: this.feedbackEmail,
          content: this.feedbackContent
        }).then(function (response) {
          console.log(response)
          self.$refs.feedbackModal.hide()
        })
      }
    },
    onResetFeedback (evt) {
      evt.preventDefault()
      this.feedbackEmail = ''
      this.feedbackContent = ''
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
  position: absolute;
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
