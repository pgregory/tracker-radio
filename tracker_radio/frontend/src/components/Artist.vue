<template>
  <div id="content">
    <v-container v-if="artist" grid-list-xl>
      <v-layout row>
        <v-flex sm2>
          <v-img :src="getRandomAvatar(artist.id)"></v-img>
        </v-flex>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h2>{{ artist.name }}</h2>
            <h4>{{ numtracks }} Tracks</h4>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <TrackList v-bind:artistId="artistId" v-bind:user="user"
            v-on:num-tracks="numtracks = $event"
            v-on:track-selected="trackSelected($event)"
            v-on:play-track="playTrack($event)"></TrackList>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import TrackList from './TrackList.vue'
import mixins from '../mixins.js'

export default {
  data () {
    return {
      artistId: null,
      artist: null,
      numtracks: 0
    }
  },
  props: {
    user: Object
  },
  components: {
    TrackList
  },
  mixins: [
    mixins
  ],
  methods: {
    getArtistData () {
      if (this.artistId) {
        const path = process.env.API_BASE_URL + `api/artists/${this.artistId}`
        axios.get(path)
          .then(response => {
            this.artist = response.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    trackSelected (trackId) {
      this.$emit('track-selected', trackId)
    },
    playTrack (trackId) {
      this.$emit('play-track', trackId)
    }
  },
  created () {
    this.artistId = parseInt(this.$route.params.id)
    this.getArtistData()
  }
}
</script>

<style scoped>
.artist {
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
}
.artist.empty {
  background-color: lightslategrey;
}
.artist-name {
  color: white;
  flex-shrink: 0;
}
.artist-image {
  flex: auto;
  display: flex;
  min-height: 0;
  width: 100%;
}
.artist-image-container {
  padding: 5px;
  flex: auto;
  width: 100%;
}
.artist-image-container img {
  height: 132px;
  border-radius: 25%;
}
</style>
