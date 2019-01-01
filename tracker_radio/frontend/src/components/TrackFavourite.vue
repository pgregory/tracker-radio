// TrackFavourite.vue

<template>
  <v-tooltip bottom v-if="user == null">
    <v-btn slot="activator" icon flat @click.stop>
      <v-icon medium color="grey">favorite</v-icon>
    </v-btn>
    <span>Login/Sign Up to Choose Favourites</span>
  </v-tooltip>
  <v-btn
    v-else
    icon
    flat
    v-on:click.stop="onFavouriteTrack(track)">
    <v-icon medium :color="track.is_favourite_of_current_user? 'red' : 'grey'">
      favorite
    </v-icon>
  </v-btn>
</template>

<script>
import mixins from '../mixins.js'

export default {
  data () {
    return {
    }
  },
  props: {
    user: Object,
    track: Object
  },
  mixins: [
    mixins
  ],
  methods: {
    onFavouriteTrack (track) {
      this.setFavourite(track)
    }
  }
}
</script>

<style scoped>
</style>
