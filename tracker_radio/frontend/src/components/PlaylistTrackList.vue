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
              <td class="track-artist">{{ props.item.artist.name }}</td>
              <td class="track-play">
                <v-icon large v-on:click.stop="onPlayTrack(props.item)">play_arrow</v-icon>
              </td>
              <td class="track-rating">
                <star-rating v-model="props.item.average_rating" v-bind:star-size="20" v-bind:read-only="true"></star-rating>
              </td>
              <td class="track-remove">
                <v-btn v-on:click="onRemoveTrack(props.item.id)" icon>
                  <v-icon>delete</v-icon>
                </v-btn>
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
      ]
    }
  },
  props: {
    user: Object,
    playlistId: Number
  },
  methods: {
    getPlaylistTracksFromBackend () {
      if (this.playlistId) {
        const path = process.env.API_BASE_URL + `api/playlists/${this.playlistId}/tracks`
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
    StarRating
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
.tracks td.track-rating, .tracks th.track-rating {
  display: flex;
  justify-content: flex-end;
}
</style>
