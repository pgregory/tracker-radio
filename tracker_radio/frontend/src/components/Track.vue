// Track.vue

<template>
  <div id="content">
    <v-container v-if="track" grid-list-xl>
      <v-layout row>
        <v-flex sm2>
          <v-img :src="getRandomAvatar(track.artist.id)"></v-img>
        </v-flex>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h3 class="track-title">{{ track.title }}</h3>
            <router-link :to="{ name: 'artist', params: { id: track.artist.id } }">
              <h4 class="artist-name">{{ track.artist.name }}</h4>
            </router-link>
            <v-btn
              icon
              v-on:click="onPlay">
              <v-icon large>play_circle_filled</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink>
          <track-rating :user="user" :track="track"
            @track-changed="getTrackData()"></track-rating>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink>
          <track-favourite :user="user" :track="track"
            @track-changed="getTrackData()">
          </track-favourite>
        </v-flex>
        <v-flex shrink>
          <v-menu bottom left @click.native.stop.prevent>
            <v-btn slot="activator"
                    icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list dense>
              <v-menu offset-x open-on-hover>
                <v-list-tile slot="activator">
                  <v-list-tile-title>Add to Playlist</v-list-tile-title>
                  <v-list-tile-action class="justify-end">
                    <v-icon>play_arrow</v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <v-list dense>
                  <v-list-tile
                    v-for="playlist in playlists"
                    v-bind:key="playlist.id"
                    v-on:click="addTrackToPlaylist(track.id, playlist.id)">
                      {{ playlist.title }}
                  </v-list-tile>
                </v-list>
              </v-menu>
              <v-list-tile>
                <a :href="getWeTrackerLink(track)" target="_blank">
                  Open in WeTracker
                </a>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink>
          <we-tracker :user="user" :track="track"></we-tracker>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import mixins from '../mixins.js'
import TrackRating from './TrackRating.vue'
import TrackFavourite from './TrackFavourite.vue'
import WeTracker from './WeTracker.vue'

export default {
  name: 'Track',
  props: {
    user: Object
  },
  data () {
    return {
      trackId: null,
      track: null,
      playlists: []
    }
  },
  components: {
    TrackRating,
    TrackFavourite,
    WeTracker
  },
  watch: {
    user (val, oldval) {
      this.getTrackData()
    },
    trackId (val, oldval) {
      this.getTrackData()
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.trackId = to.params.id
    this.getTrackData()
    next()
  },
  methods: {
    async getTrackData () {
      if (this.trackId) {
        const path = process.env.API_BASE_URL + `api/tracks/${this.trackId}`
        if (this.user) {
          const idToken = await this.user.getIdToken(true)
          await axios.get(path, {
            headers: { 'Authorization': 'bearer ' + idToken }
          })
            .then(response => {
              this.track = response.data
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          await axios.get(path)
            .then(response => {
              this.track = response.data
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    getPlaylistsFromBackend () {
      const path = process.env.API_BASE_URL + `api/playlists`
      const self = this
      if (this.user) {
        this.user.getIdToken(true).then(function (idToken) {
          axios.get(path,
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.playlists = response.data
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    onPlay () {
      this.$emit('play-track', this.trackId)
    }
  },
  mixins: [
    mixins
  ],
  created () {
    this.trackId = parseInt(this.$route.params.id)
    this.getTrackData().then(() => {
      if (this.$route.query.play === '1') {
        this.onPlay()
      }
    })
    this.getPlaylistsFromBackend()
  }
}
</script>

<style scoped>
h3.track-title {
  text-align: left;
}
h4.artist-name {
  font-size: 18px;
  text-align: left;
  color: darkgrey;
}
.artist-image {
  flex-grow: 0;
  margin-right: 5px;
}
</style>
