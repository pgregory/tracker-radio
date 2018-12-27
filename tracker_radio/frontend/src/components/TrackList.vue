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
              <td class="track-index">{{ props.index }}</td>
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
                  </v-list>
                </v-menu>
              </td>
              <td class="track-rating">
                <star-rating v-model="props.item.average_rating" v-bind:star-size="20" v-bind:read-only="true"></star-rating>
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
          text: 'Average Rating',
          align: 'right',
          sortable: true,
          value: 'average_rating'
        }
      ],
      playlists: []
    }
  },
  props: {
    user: Object,
    artistId: Number
  },
  watch: {
    artistId (val, oldval) {
      this.updateArtistTracks(val)
      // this.$emit('track-selected', null)
    },
    user (val, oldval) {
      this.updatePlaylists()
    }
  },
  methods: {
    getArtistTracksFromBackend () {
      if (this.artistId) {
        const path = process.env.API_BASE_URL + `api/artists/` + this.artistId + `/tracks`
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
    setRating (rating, track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track + `/rate`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          self.$gtm.trackEvent({
            event: 'track-rate',
            action: 'rate',
            category: 'Track',
            label: 'Track Rated',
            track_id: track,
            rating: rating
          })
          axios.post(path, {
            rating: rating
          }, { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              console.log(response)
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    setFavourite (track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track + `/favourite`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          console.log(user)
          self.$gtm.trackEvent({
            event: 'track-favourite',
            action: 'favourite',
            category: 'Track',
            label: 'Track Favourited',
            track_id: track
          })
          axios.post(path, {},
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.isFavourite = true
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
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
.tracks td.track-rating, .tracks th.track-rating {
  display: flex;
  justify-content: flex-end;
}
</style>
