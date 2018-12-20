<template>
  <b-card id="playlists"
          class="panel"
          no-body
          header="Playlists">
    <b-card-body class="playlists-list">
      <div>
        <h4>My Playlists</h4>
        <b-table striped hover responsive :items="playlists" :fields="playlist_fields"
          v-on:row-clicked="playlistSelected"
          thead-class="hidden_header"
          small>
          <template slot="edit" slot-scope="data">
            <b-button v-if="allowEdit" v-on:click="onEditPlaylist(data.item)" size="sm">
              <font-awesome-icon icon="edit"/>
            </b-button>
            <b-button v-if="allowEdit" v-on:click="onDeletePlaylist(data.item)" size="sm"
              variant="danger">
              <font-awesome-icon icon="trash"/>
            </b-button>
          </template>
        </b-table>
        <h4>Auto Playlists</h4>
        <b-table striped hover responsive :items="autoPlaylists" :fields="auto_playlist_fields"
          v-on:row-clicked="autoPlaylistSelected"
          thead-class="hidden_header"
          small>
        </b-table>
      </div>
    </b-card-body>
    <!-- Edit Playlist Modal -->
    <b-modal ref="editPlaylistModal"
      id="edit-playlist-modal"
      title="Edit Playlist"
      lazy
      v-model="editPlaylistModalShow"
      v-on:ok="onEditPlaylistSubmit">
      <b-form v-if="selectedPlaylist">
        <b-form-group id="playlistTitleGroup"
                      label="Title"
                      label-for="playlistTitle">
          <b-form-input id="playlistTitle"
                        type="text"
                        v-model="selectedPlaylist.title"/>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-card-footer>
      <b-form>
        <b-input-group id="playlistTitleGroup" prepend="New">
          <b-form-input id="playlistTitle"
                        type="text"
                        v-model="newPlaylistTitle"></b-form-input>
          <b-button slot="append" :disabled="newPlaylistTitle == ''"
            v-on:click="onNewPlaylistSubmit">
            <font-awesome-icon icon="plus-square"></font-awesome-icon>
          </b-button>
        </b-input-group>
      </b-form>
    </b-card-footer>
  </b-card>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    var playlistFields = [
      {
        key: 'title',
        label: 'Title'
      }
    ]
    if (this.allowEdit) {
      playlistFields.push({
        key: 'edit',
        label: '',
        class: 'fit'
      })
    }
    return {
      playlist_fields: playlistFields,
      playlists: [],
      selectedPlaylist: null,
      newPlaylistTitle: '',
      editPlaylistModalShow: false,
      autoPlaylists: [ {
        'title': 'Favourites',
        'id': 'favourites'
      } ],
      auto_playlist_fields: [ 'title' ]
    }
  },
  props: {
    user: Object,
    allowEdit: true
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
    getPlaylists () {
      this.playlists = []
      this.getPlaylistsFromBackend()
    },
    playlistSelected (item, index) {
      this.$emit('playlist-selected', {id: item.id, auto: false})
    },
    autoPlaylistSelected (item, index) {
      this.$emit('playlist-selected', {id: item.id, auto: true})
    },
    onEditPlaylist (playlist) {
      this.selectedPlaylist = playlist
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
              console.log(response)
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
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
  mounted () {
    this.getPlaylistsFromBackend()
    console.log(this.allowEdit)
  }

}
</script>

<style scoped>
.playlists-list {
  display: flex;
  flex-direction: column;
  overflow: scroll;
}
.playlists-list .table {
  margin-bottom: 0;
}
</style>
<style>
.hidden_header {
  display: none;
}
.table td.fit,
.tabel th.fit {
  white-space: nowrap;
  width: 1%;
}
</style>
