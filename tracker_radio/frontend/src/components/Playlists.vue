// Playlists.vue

<template>
  <v-container id="content">
    <div id="artists-panel">
      <v-layout row justify-center>
        <h2>Playlists</h2>
      </v-layout>
      <v-container grid-list-lg>
        <v-layout row wrap ref="playlists">
          <v-flex v-for="(playlist, index) in playlists" ref="playlist" v-bind:key="playlist.id" :data-index="index" >
            <v-card
              hover
              width="150"
              height="100%"
              v-on:click="onPlaylistSelected(playlist)">
              <v-img :src="getRandomAvatar()">
              </v-img>
              <v-card-title>
                {{ playlist.title }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import PlaylistList from './PlaylistList.vue'
import PlaylistTrackList from './PlaylistTrackList.vue'
import TrackPlayer from './TrackPlayer.vue'
import axios from 'axios'
import firebase from 'firebase'

export default {
  name: 'Playlists',
  props: {
    user: Object
  },
  data () {
    return {
      playlistId: null,
      playlist: [],
      trackId: null,
      editablePlaylist: false,
      playlists: []
    }
  },
  watch: {
    user (val, oldval) {
      this.getPlaylistsFromBackend()
    }
  },
  methods: {
    getPlaylistsFromBackend () {
      const path = process.env.API_BASE_URL + `api/playlists`
      const self = this
      if (this.user) {
        this.user.getIdToken(true).then(function (idToken) {
          axios.get(path,
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.playlists = response.data
              console.log(self.playlists)
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    getPlaylistTracksFromBackend () {
      if (this.playlistId) {
        const user = firebase.auth().currentUser
        if (user) {
          const self = this
          user.getIdToken(true).then(function (idToken) {
            const path = process.env.API_BASE_URL + `api/playlists/${self.playlistId}/tracks`
            axios.get(path, {
              headers: { 'Authorization': 'bearer ' + idToken } })
              .then(response => {
                self.playlist = response.data
              })
              .catch(error => {
                console.log(error)
              })
          })
        }
      }
    },
    getPlaylistTracks () {
      this.tracks = []
      this.getPlaylistTracksFromBackend()
    },
    onPlaylistSelected (playlist) {
      this.playlistId = playlist.id
      this.editablePlaylist = !playlist.auto
      this.$router.push({ path: `/playlists/${this.playlistId}` })
    },
    getRandomAvatar () {
      var index = Math.ceil(Math.random() * 6)
      var strIndex = ('000' + index).slice(-3)
      return `/static/cover-${strIndex}.png`
    }
  },
  components: {
    PlaylistList,
    PlaylistTrackList,
    TrackPlayer
  },
  created () {
    this.getPlaylistsFromBackend()
  }
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  flex: auto;
  min-height: 0;
}
#playlists-panel {
  flex: auto;
  display: flex;
  flex-direction: row;
  min-height: 0;
  margin-bottom: 10px;
  margin-top: 10px;
}
#playlists-panel .row {
  flex: auto;
}
.lists {
  display: flex;
  flex-direction: column;
}
#playlists-panel .lists .row {
  flex: 1;
}
.lists .row.playlists {
  margin-bottom: 10px;
}
.lists .row.tracks {
  margin-top: 10px;
}
.panel {
  height: 100%;
}
</style>
