<template>
  <div id="content">
    <v-container grid-list-xl>
      <v-layout row>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h2>Popular Tracks</h2>
            <h4>{{ numtracks }} Tracks</h4>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <PopularTrackList v-bind:user="user"
            v-on:num-tracks="numtracks = $event"
            v-on:track-selected="trackSelected($event)"
            v-on:play-track="playTrack($event)"></PopularTrackList>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import PopularTrackList from './PopularTrackList.vue'
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
    PopularTrackList
  },
  mixins: [
    mixins
  ],
  methods: {
    trackSelected (trackId) {
      this.$emit('track-selected', trackId)
    },
    playTrack (trackId) {
      this.$emit('play-track', trackId)
    }
  }
}
</script>

<style scoped>
</style>
