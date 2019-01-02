// TrackRating.vue

<template>
  <v-tooltip bottom v-if="user == null">
    <div class="rating"
      slot="activator">
      <span class="rating-text">
        ({{ track.average_rating | roundRating }})
      </span>
      <v-rating
        @click.native.prevent.stop
        v-model="track.average_rating"
        :size="20"
        read-only
        dense>
      </v-rating>
    </div>
    <span>Login/Sign Up to Rate Tracks</span>
  </v-tooltip>
  <div v-else class="rating">
    <span class="rating-text">
      ({{ track.average_rating | roundRating }})
    </span>
    <v-rating
      v-model="track.average_rating"
      @click.native.prevent.stop
      :size="20"
      hover
      dense
      :read-only="user == null"
      v-on:input="onSetRating($event, track)">
    </v-rating>
  </div>
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
    onSetRating (rating, track) {
      console.log(rating)
      this.setRating(rating, track).then(() => {
        this.$emit('track-changed', track.id)
      })
    }
  },
  filters: {
    roundRating (rating) {
      return rating.toFixed(1)
    }
  }
}
</script>

<style scoped>
.v-tooltip {
  display: flex;
  align-items: center;
}
.rating {
  display: flex;
  justify-content: center;
  align-items: center;
}
.rating .v-rating {
  white-space: nowrap;
}
</style>
