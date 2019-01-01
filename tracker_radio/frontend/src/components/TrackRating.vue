// TrackRating.vue

<template>
  <v-tooltip bottom v-if="user == null">
    <star-rating
      slot="activator"
      @click.native.prevent.stop
      v-model="track.average_rating"
      :star-size="20"
      read-only>
    </star-rating>
    <span>Login/Sign Up to Rate Tracks</span>
  </v-tooltip>
  <star-rating v-else
    @click.native.prevent.stop
    v-model="track.average_rating"
    :star-size="20"
    :read-only="user == null"
    v-on:rating-selected="onSetRating($event, track)">
  </star-rating>
</template>

<script>
import StarRating from 'vue-star-rating'
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
    onSetRating (rating, track) {
      this.setRating(rating, track).then(() => {
        this.getArtistTracksFromBackend()
      })
    }
  },
  components: {
    StarRating
  }
}
</script>

<style scoped>
.v-tooltip {
  display: flex;
  align-items: center;
}
</style>
