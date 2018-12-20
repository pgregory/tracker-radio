<template>
  <b-card id="tracks"
          class="panel"
          no-body
          header="Tracks">
    <b-card-body class="tracks-list">
      <b-table striped hover responsive :items="playlist" :fields="track_fields"
        v-on:row-clicked="trackSelected"
        small>
        <template slot="artist" slot-scope="data">
          {{ data.item.artist.name }}
        </template>
        <template slot="rating" slot-scope="data">
          <star-rating v-model="data.item.average_rating" v-bind:star-size="20" v-bind:read-only="true"></star-rating>
        </template>
        <template slot="remove" slot-scope="data">
          <b-button
            v-on:click="onRemoveTrack(data.item.id)" size="sm" variant="danger"
            v-if="editablePlaylist">
            <font-awesome-icon icon="trash"></font-awesome-icon>
          </b-button>
        </template>
      </b-table>
    </b-card-body>
  </b-card>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'
import firebase from 'firebase'

export default {
  data () {
    return {
      track_fields: [
        {
          key: 'title',
          label: 'Title'
        },
        {
          key: 'artist',
          label: 'Artist'
        },
        {
          key: 'rating',
          label: 'Rating'
        }
      ],
      tracks: []
    }
  },
  props: {
    user: Object,
    playlist: Array,
    editablePlaylist: Boolean
  },
  watch: {
    playlist (val, oldval) {
      this.$emit('track-selected', null)
    },
    editablePlaylist (val, oldval) {
      this.track_fields = [
        {
          key: 'title',
          label: 'Title'
        },
        {
          key: 'artist',
          label: 'Artist'
        },
        {
          key: 'rating',
          label: 'Rating'
        }
      ]
      if (val) {
        this.track_fields.push({
          key: 'remove',
          label: 'Remove'
        })
      }
    }
  },
  methods: {
    trackSelected (item, index) {
      this.$emit('track-selected', item.id)
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
    }
  },
  components: {
    StarRating
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
