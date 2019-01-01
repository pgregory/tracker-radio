<template>
  <v-layout row>
    <v-flex sm12>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="tracks"
          class="elevation-1 tracks"
          hide-actions
          disable-initial-sort>
          <template slot="items" slot-scope="props">
            <tr v-on:click="trackSelected(props.item.track)">
              <td class="track-title">{{ props.item.track.title }}</td>
              <td class="track-artist">{{ props.item.track.artist.name }}</td>
              <td class="track-play">
                <v-icon large v-on:click.stop.prevent="onPlayTrack(props.item.track)">play_arrow</v-icon>
              </td>
              <td class="track-edit">
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
                          v-on:click="addTrackToPlaylist(props.item.track.id, playlist.id)">
                            {{ playlist.title }}
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-list-tile>
                      <a :href="getTrackLocation(props.item.track)" target="_blank">
                        Open in WeTracker
                      </a>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
              <td class="track-favourite">
                <track-favourite :user="user" :track="props.item.track"
                  @track-changed="updatePopularTracks()"></track-favourite>
              </td>
              <td class="track-rating">
                <track-rating :user="user" :track="props.item.track"></track-rating>
              </td>
              <td class="track-votes">{{ props.item.rating_count }}</td>
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
          text: 'Title',
          align: 'left',
          sortable: true,
          class: 'track-title',
          value: 'track.title'
        },
        {
          text: 'Artist',
          align: 'left',
          sortable: true,
          class: 'track-artist',
          value: 'track.artist.name'
        },
        {
          text: '',
          sortable: false,
          class: 'track-play'
        },
        {
          text: '',
          sortable: false,
          class: 'track-edit'
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
          value: 'track.average_rating'
        },
        {
          text: 'Votes',
          align: 'right',
          sortable: true,
          value: 'rating_count'
        }
      ],
      playlists: [],
      isFavourites: {}
    }
  },
  props: {
    user: Object,
    artistId: Number
  },
  watch: {
    artistId (val, oldval) {
      this.updatePopularTracks(val)
    },
    user (val, oldval) {
      this.updatePopularTracks(val)
      this.updatePlaylists()
    }
  },
  mixins: [
    mixins
  ],
  methods: {
    getPopularTracksFromBackend () {
      const path = process.env.API_BASE_URL + `api/tracks/popular`
      if (this.user) {
        var self = this
        this.user.getIdToken(true).then(function (idToken) {
          axios.get(path,
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(response => {
              self.tracks = response.data
              self.$emit('num-tracks', self.tracks.length)
            })
            .catch(error => {
              console.log(error)
            })
        })
      } else {
        axios.get(path)
          .then(response => {
            this.tracks = response.data
            this.$emit('num-tracks', this.tracks.length)
          })
          .catch(error => {
            console.log(error)
          })
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
    getPopularTracks () {
      this.tracks = []
      this.getPopularTracksFromBackend()
    },
    getPlaylists () {
      this.playlists = []
      this.getPlaylistsFromBackend()
    },
    updatePopularTracks () {
      this.getPopularTracksFromBackend()
    },
    updatePlaylists () {
      this.getPlaylistsFromBackend()
    },
    trackSelected (item, index) {
      this.$router.push({ name: 'track', params: { id: item.id } })
    },
    onPlayTrack (track) {
      this.$emit('play-track', track.id)
    },
    addTrackToPlaylist (trackId, playlistId) {
      const path = process.env.API_BASE_URL + `api/playlists/${playlistId}/tracks/${trackId}`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          self.$gtm.trackEvent({
            event: 'playlist-add-track',
            action: 'add-track',
            category: 'Playlist',
            label: 'Track Added to Playlist',
            track_id: trackId,
            playlist_id: playlistId
          })
          axios.put(path, {},
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              console.log(response)
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    getTrackLocation (track) {
      const playerRoot = 'http://app.wetracker.xyz/#/loadsong?url='
      var url = encodeURI('https://modland.com/pub/modules/Fasttracker 2/' + track.location)
      return playerRoot + url
    }
  },
  components: {
    TrackRating,
    TrackFavourite
  },
  created () {
    this.getPopularTracks()
    this.getPlaylists()
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
.tracks td.track-edit, .tracks th.track-edit {
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
.tracks td.track-votes, .tracks th.track-votes {
  white-space: nowrap;
  width: 1px;
}
</style>
