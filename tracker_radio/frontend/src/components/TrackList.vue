<template>
  <b-card id="tracks"
          class="panel"
          no-body
          header="Tracks">
    <b-card-body class="tracks-list">
      <b-table striped hover responsive :items="tracks" :fields="track_fields"
        v-on:row-clicked="trackSelected"
        small>
        <template slot="artist" slot-scope="data">
          {{ data.item.artist[0].name }}
        </template>
        <template slot="rating" slot-scope="data">
          <star-rating v-model="data.item.average_rating" v-bind:star-size="20" v-bind:read-only="true"></star-rating>
        </template>
      </b-table>
    </b-card-body>
  </b-card>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default {
  data () {
    return {
      track_fields: [ 'title', 'rating' ],
      tracks: []
    }
  },
  props: {
    user: Object,
    artistId: Number
  },
  watch: {
    artistId (val, oldval) {
      this.updateArtistTracks(val)
      this.$emit('track-selected', null)
    }
  },
  methods: {
    getArtistTracksFromBackend () {
      if (this.artistId) {
        const path = process.env.API_BASE_URL + `api/artists/` + this.artistId + `/tracks`
        axios.get(path)
          .then(response => {
            this.tracks = response.data
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
