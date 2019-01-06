// Playlist.vue

<template>
  <div id="content">
    <v-container v-if="playlist" grid-list-xl>
      <v-layout row>
        <v-flex sm2>
          <v-img :src="getRandomAvatar(playlist.id)"></v-img>
        </v-flex>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h2>{{ playlist.title }}</h2>
            <h4>{{ numtracks }} Tracks</h4>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <PlaylistTrackList v-bind:playlistId="playlistId" v-bind:user="user"
            v-on:num-tracks="numtracks = $event"
            v-on:track-selected="trackSelected($event)"
            v-on:play-track="playTrack($event)"></PlaylistTrackList>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import PlaylistTrackList from './PlaylistTrackList.vue'
import mixins from '../mixins.js'

export default {
  data () {
    return {
      playlistId: null,
      playlist: null,
      numtracks: 0
    }
  },
  props: {
    user: Object
  },
  watch: {
    user (val, oldval) {
      this.getPlaylistData()
    }
  },
  components: {
    PlaylistTrackList
  },
  mixins: [
    mixins
  ],
  methods: {
    getPlaylistData () {
      if (this.playlistId) {
        const path = process.env.API_BASE_URL + `api/playlists/${this.playlistId}`
        if (this.user) {
          var self = this
          this.user.getIdToken(true).then(function (idToken) {
            axios.get(path,
              { headers: { 'Authorization': 'bearer ' + idToken } })
              .then(response => {
                self.playlist = response.data
              }).catch(error => {
                console.log(error)
              })
          })
        }
      }
    },
    trackSelected (trackId) {
      this.$emit('track-selected', trackId)
    },
    playTrack (trackId) {
      this.$emit('play-track', trackId)
    }
  },
  created () {
    this.playlistId = parseInt(this.$route.params.id)
    this.getPlaylistData()
  }
}
</script>

<style scoped>
</style>
