<template>
  <v-layout row>
    <v-flex sm12>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="tracks"
          class="elevation-1 tracks"
          hide-actions>
          <template slot="items" slot-scope="props">
            <tr v-on:click="trackSelected(props.item)">
              <td class="track-title">{{ props.item.title }}</td>
              <td class="track-play">
                <v-icon large v-on:click.stop.prevent="onPlayTrack(props.item)">play_arrow</v-icon>
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
                          v-on:click="addTrackToPlaylist(props.item.id, playlist.id)">
                            {{ playlist.title }}
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                    <v-list-tile>
                      <a :href="getTrackLocation(props.item)" target="_blank">
                        Open in WeTracker
                      </a>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
              <td class="track-favourite">
                <v-btn
                  icon
                  flat
                  v-on:click.stop="onFavouriteTrack(props.item)">
                  <v-icon medium :color="props.item.is_favourite_of_current_user? 'red' : 'grey'">
                    favorite
                  </v-icon>
                </v-btn>
              </td>
              <td class="track-rating">
                <star-rating
                  @click.native.prevent.stop
                  v-model="props.item.average_rating"
                  :star-size="20"
                  v-on:rating-selected="onSetRating($event, props.item)">
                </star-rating>
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
import StarRating from 'vue-star-rating'
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
          value: 'title'
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
          value: 'average_rating'
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
      this.updateArtistTracks(val)
    },
    user (val, oldval) {
      this.updateArtistTracks(val)
      this.updatePlaylists()
    }
  },
  mixins: [
    mixins
  ],
  methods: {
    getArtistTracksFromBackend () {
      if (this.artistId) {
        const path = process.env.API_BASE_URL + `api/artists/` + this.artistId + `/tracks`
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
    getArtistTracks () {
      this.tracks = []
      this.getArtistTracksFromBackend()
    },
    getPlaylists () {
      this.playlists = []
      this.getPlaylistsFromBackend()
    },
    updateArtistTracks (artistId) {
      this.getArtistTracksFromBackend()
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
    onFavouriteTrack (track) {
      this.setFavourite(track).then(() => {
        this.getArtistTracksFromBackend()
      })
    },
    onSetRating (rating, track) {
      this.setRating(rating, track).then(() => {
        this.getArtistTracksFromBackend()
      })
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
    StarRating
  },
  created () {
    this.getArtistTracks()
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
  width: 100%;
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
</style>
