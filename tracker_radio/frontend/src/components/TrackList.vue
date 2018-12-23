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
              <td class="track-play"><v-icon large v-on:click="onPlayTrack(props.item)">play_arrow</v-icon></td>
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
          text: 'Average Rating',
          align: 'right',
          sortable: true,
          value: 'average_rating'
        }
      ]
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
    getArtistTracks () {
      this.tracks = []
      this.getArtistTracksFromBackend()
    },
    updateArtistTracks (artistId) {
      this.getArtistTracksFromBackend()
    },
    getTrackLocation (track) {
      const playerRoot = 'http://app.wetracker.xyz/#/loadsong?play=1&url='
      var url = encodeURI('https://modland.ziphoid.com/pub/modules/Fasttracker 2/' + track.location)
      return playerRoot + url
    },
    trackSelected (item, index) {
      this.$emit('track-selected', item.id)
    },
    onPlayTrack (track) {
      this.$emit('play-track', track.id)
    }
  },
  components: {
    StarRating
  },
  created () {
    this.getArtistTracks()
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
.tracks td.track-rating, .tracks th.track-rating {
  display: flex;
  justify-content: flex-end;
}
</style>
