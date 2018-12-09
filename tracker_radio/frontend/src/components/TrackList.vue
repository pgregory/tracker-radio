<template>
  <b-container id="tracks">
    <b-container id="track-list">
      <b-table striped hover :items="tracks" :fields="track_fields"
        dark
        v-on:row-clicked="trackSelected">
        <template slot="artist" slot-scope="data">
          {{ data.item.artist[0].name }}
        </template>
        <template slot="rank" slot-scope="data">
          <star-rating v-model="data.item.average_rating" v-bind:star-size="20" v-bind:read-only="true"></star-rating>
        </template>
      </b-table>
    </b-container>
  </b-container>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'

export default {
  data () {
    return {
      track_fields: [ 'title', 'rank' ],
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
#tracks-title {
  flex-shrink: 0;
}
#track-list  {
  overflow-y: scroll;
  border: 2px solid rgb(0,255,0);
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  -moz-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  margin-bottom: 15px;
  margin-top: 15px;
  flex: auto;
  background-color: #212529;
  padding: 0;
}

#track-list .table {
  margin-bottom: 0;
}
</style>
