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
              height="100%">
              <v-img :src="getRandomAvatar(playlist.id)"
                v-on:click="onPlaylistSelected(playlist)">
              </v-img>
              <v-card-title>
                {{ playlist.title }}
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-menu bottom left>
                  <v-btn slot="activator"
                         icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile
                         v-on:click="editPlaylist(playlist)">
                      Edit
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <!-- Edit Playlist Modal -->
    <v-dialog ref="editPlaylistModal"
      id="edit-playlist-modal"
      title="Edit Playlist"
      v-model="editPlaylistModalShow"
      max-width="600px"
      v-on:ok="onEditPlaylistSubmit">
      <v-card v-if="selectedPlaylist">
        <v-card-title>
          <span class="headline">Edit Playlist</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Title*" required
                  v-model="selectedPlaylist.title">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"
                 flat v-on:click="onEditPlaylistCancel">
            Close
          </v-btn>
          <v-btn color="blue darken-1"
                 flat
                 v-on:click="onEditPlaylistSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PlaylistList from './PlaylistList.vue'
import PlaylistTrackList from './PlaylistTrackList.vue'
import TrackPlayer from './TrackPlayer.vue'
import axios from 'axios'
import firebase from 'firebase'
import mixins from '../mixins.js'

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
      playlists: [],
      editPlaylistModalShow: false,
      selectedPlaylist: null
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
    editPlaylist (playlist) {
      this.selectedPlaylist = playlist
      this.cachedPlaylist = Object.assign({}, this.selectedPlaylist)
      this.editPlaylistModalShow = true
    },
    onEditPlaylistSubmit () {
      const self = this
      if (this.user) {
        this.user.getIdToken(true).then(function (idToken) {
          const path = process.env.API_BASE_URL + `api/playlists/${self.selectedPlaylist.id}`
          axios.patch(path, {
            'title': self.selectedPlaylist.title
          }, { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.editPlaylistModalShow = false
            }).catch(function (error) {
              console.log(error)
              self.editPlaylistModalShow = false
            })
        })
      }
    },
    onEditPlaylistCancel () {
      this.selectedPlaylist = Object.assign(this.selectedPlaylist, this.cachedPlaylist)
      this.editPlaylistModalShow = false
    },
    onDeletePlaylist (playlist) {
      const self = this
      if (this.user) {
        this.user.getIdToken(true).then(function (idToken) {
          const path = process.env.API_BASE_URL + `api/playlists/${playlist.id}`
          axios.delete(path, { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.getPlaylistsFromBackend()
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    onNewPlaylistSubmit () {
      const self = this
      if (this.user) {
        this.user.getIdToken(true).then(function (idToken) {
          const path = process.env.API_BASE_URL + `api/playlists`
          axios.post(path, {
            'title': self.newPlaylistTitle
          }, { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.getPlaylistsFromBackend()
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    }
  },
  components: {
    PlaylistList,
    PlaylistTrackList,
    TrackPlayer
  },
  mixins: [
    mixins
  ],
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
