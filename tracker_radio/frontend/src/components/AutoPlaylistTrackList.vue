<template>
  <v-layout row>
    <v-flex sm12>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="tracks"
          class="elevation-1 tracks"
          :loading="loading"
          :no-data-text="noDataMessage">
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr v-on:click="trackSelected(props.item)">
              <td class="track-index">{{ props.index }}</td>
              <td class="track-title">{{ props.item.title }}</td>
              <td class="track-artist">{{ props.item.artist.name }}</td>
              <td class="track-play"><v-icon large v-on:click.stop.prevent="onPlayTrack(props.item)">play_arrow</v-icon></td>
              <td class="track-favourite">
                <track-favourite :user="user" :track="props.item"
                  @track-changed="onTrackChanged($event)"></track-favourite>
              </td>
              <td class="track-rating">
                <track-rating :user="user" :track="props.item"
                  @track-changed="onTrackChanged($event)"></track-rating>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'
import TrackRating from './TrackRating.vue'
import TrackFavourite from './TrackFavourite.vue'
import firebase from 'firebase'
import mixins from '../mixins.js'

export default {
  data () {
    return {
      tracks: [],
      headers: [
        {
          text: '#',
          sortable: false,
          class: 'track-index'
        },
        {
          text: 'Title',
          align: 'left',
          sortable: true,
          class: 'track-title',
          value: 'title'
        },
        {
          text: 'Artist',
          align: 'left',
          sortable: true,
          class: 'track-artist',
          value: 'artist.name'
        },
        {
          text: '',
          sortable: false,
          class: 'track-play'
        },
        {
          text: '',
          sortable: false,
          class: 'track-favourite'
        },
        {
          text: 'Average Rating',
          align: 'right',
          sortable: true,
          value: 'average_rating'
        },
        {
          text: '',
          sortable: false,
          class: 'track-remove'
        }
      ],
      loading: false,
      noDataMessage: 'Loading Playlist'
    }
  },
  props: {
    user: Object,
    playlistId: String
  },
  mixins: [
    mixins
  ],
  watch: {
    user (val, oldval) {
      this.getPlaylistTracksFromBackend()
    }
  },
  methods: {
    getPlaylistTracksFromBackend () {
      this.loading = true
      if (this.playlistId) {
        const user = firebase.auth().currentUser
        if (user) {
          const self = this
          user.getIdToken(true).then(function (idToken) {
            const path = process.env.API_BASE_URL + `api/autoplaylists/${self.playlistId}/tracks`
            axios.get(path, {
              headers: { 'Authorization': 'bearer ' + idToken }
            })
              .then(response => {
                self.tracks = response.data
                self.$emit('num-tracks', self.tracks.length)
                self.loading = false
              })
              .catch(error => {
                console.log(error)
                self.loading = false
              })
          })
        }
      }
    },
    onTrackChanged (trackId) {
      this.getSingleTrackFromBackend(trackId)
        .then(track => {
          const t = this.tracks.find(obj => {
            return obj.id === trackId
          })
          if (t) {
            Object.assign(t, track)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    trackSelected (item, index) {
      this.$router.push({ name: 'track', params: { id: item.id } })
    },
    onRemoveTrack (trackId) {
      if (this.playlistId) {
        const user = firebase.auth().currentUser
        if (user) {
          const self = this
          user.getIdToken(true).then(function (idToken) {
            const path = process.env.API_BASE_URL + `api/playlists/${self.playlistId}/tracks/${trackId}`
            axios.delete(path, {
              headers: { 'Authorization': 'bearer ' + idToken }})
              .then(response => {
                self.getPlaylistTracksFromBackend()
              })
              .catch(error => {
                console.log(error)
              })
          })
        }
      }
    },
    onPlayTrack (track) {
      this.$emit('play-track', track.id)
    }
  },
  components: {
    TrackRating,
    TrackFavourite
  },
  created () {
    this.getPlaylistTracksFromBackend()
  }
}
</script>

<style scoped>
.tracks-list {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: 0;
}
.tracks-list .table {
  margin-bottom: 0;
}
</style>
<style>
.tracks td.track-title, .tracks th.track-title {
  text-align: left;
  width: 50%;
}
.tracks td.track-artist, .tracks th.track-artist {
  text-align: left;
  width: 50%;
}
.tracks td.track-index, .tracks th.track-index {
  white-space: nowrap;
  width: 1px;
}
.tracks td.track-play, .tracks th.track-play {
  white-space: nowrap;
  width: 1px;
}
.tracks td.track-favourite, .tracks th.track-favourite {
  white-space: nowrap;
  width: 1px;
}
.tracks td.track-rating, .tracks th.track-rating {
  display: flex;
  justify-content: flex-end;
}
</style>
