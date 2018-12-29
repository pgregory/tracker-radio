// Playlists.vue

<template>
  <v-container id="content">
    <v-container id="my-playlists-panel">
      <v-layout row justify-center>
        <h2>My Playlists</h2>
      </v-layout>
      <v-container grid-list-lg>
        <v-layout row wrap align-start justify-start fill-height ref="playlists">
          <v-flex
            shrink
            v-for="(playlist, index) in playlists"
            ref="playlist"
            v-bind:key="playlist.id"
            :data-index="index" >
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
                         v-on:click="onEditPlaylist(playlist)">
                      Edit
                    </v-list-tile>
                    <v-list-tile
                         v-on:click="onDeletePlaylist(playlist)">
                      Delete
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <v-btn
          fab
          v-on:click="addPlaylist">
          <v-icon>add</v-icon>
        </v-btn>
      </v-container>
    </v-container>
    <v-container id="auto-playlists-panel">
      <v-layout row justify-center>
        <h2>Auto Playlists</h2>
      </v-layout>
      <v-container grid-list-lg>
        <v-layout row wrap align-start justify-start fill-height ref="auto-playlists">
          <v-flex
            shrink
            v-for="(playlist, index) in autoPlaylists"
            ref="playlist"
            v-bind:key="playlist.id"
            :data-index="index" >
            <v-card
              hover
              width="150"
              height="100%">
              <v-img :src="getRandomAvatar(playlist.ref)"
                v-on:click="onAutoPlaylistSelected(playlist)">
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
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
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
    <!-- New Playlist Modal -->
    <v-dialog ref="newPlaylistModal"
      id="new-playlist-modal"
      title="New Playlist"
      v-model="newPlaylistModalShow"
      max-width="600px"
      v-on:ok="onNewPlaylistSubmit">
      <v-card>
        <v-card-title>
          <span class="headline">New Playlist</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field
                  label="Title*" required
                  v-model="newPlaylistTitle">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1"
                 flat v-on:click="onNewPlaylistCancel">
            Close
          </v-btn>
          <v-btn color="blue darken-1"
                 flat
                 v-on:click="onNewPlaylistSubmit">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import PlaylistTrackList from './PlaylistTrackList.vue'
import AutoPlaylistTrackList from './AutoPlaylistTrackList.vue'
import TrackPlayer from './TrackPlayer.vue'
import axios from 'axios'
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
      selectedPlaylist: null,
      newPlaylistTitle: '',
      newPlaylistModalShow: false,
      autoPlaylists: []
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
      const autopath = process.env.API_BASE_URL + `api/autoplaylists`
      axios.get(autopath)
        .then(function (response) {
          self.autoPlaylists = response.data
        }).catch(function (error) {
          console.log(error)
        })
    },
    onPlaylistSelected (playlist) {
      this.playlistId = playlist.id
      this.$router.push({ path: `/playlists/${this.playlistId}` })
    },
    onAutoPlaylistSelected (playlist) {
      this.playlistId = playlist.id
      this.$router.push({ path: `/autoplaylists/${this.playlistId}` })
    },
    onEditPlaylist (playlist) {
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
    addPlaylist () {
      this.newPlaylistModalShow = true
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
    },
    onNewPlaylistCancel () {
      this.newPlaylistModalShow = false
    }
  },
  components: {
    PlaylistTrackList,
    AutoPlaylistTrackList,
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
