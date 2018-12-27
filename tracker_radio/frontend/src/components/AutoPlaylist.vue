// Playlist.vue

<template>
  <div id="content">
    <v-container v-if="playlist" grid-list-xl>
      <v-layout row>
        <v-flex sm2>
          <v-img :src="getRandomAvatar(playlist.ref)"></v-img>
        </v-flex>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h2>{{ playlist.title }}</h2>
            <h4>{{ numtracks }} Tracks</h4>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <AutoPlaylistTrackList v-bind:playlistId="playlistId" v-bind:user="user"
            v-on:num-tracks="numtracks = $event"
            v-on:track-selected="trackSelected($event)"
            v-on:play-track="playTrack($event)"></AutoPlaylistTrackList>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import AutoPlaylistTrackList from './AutoPlaylistTrackList.vue'
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
    AutoPlaylistTrackList
  },
  mixins: [
    mixins
  ],
  methods: {
    getPlaylistData () {
      if (this.playlistId) {
        const path = process.env.API_BASE_URL + `api/autoplaylists/${this.playlistId}`
        axios.get(path)
          .then(response => {
            this.playlist = response.data
          }).catch(error => {
            console.log(error)
          })
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
    this.playlistId = this.$route.params.id
    this.getPlaylistData()
  }
}
</script>

<style scoped>
</style>
