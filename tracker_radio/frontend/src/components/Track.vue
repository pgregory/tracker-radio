// Track.vue

<template>
  <div id="content">
    <v-container v-if="track" grid-list-xl>
      <v-layout row>
        <v-flex sm2>
          <v-img :src="getRandomAvatar(track.artist.id)"></v-img>
        </v-flex>
        <v-flex sm6>
          <v-layout column fill-height align-start justify-center>
            <h3 class="track-title">{{ track.title }}</h3>
            <h4 class="artist-name">{{ track.artist.name }}</h4>
            <v-btn
              icon
              v-on:click="onPlay">
              <v-icon large>play_circle_filled</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink>
          <star-rating
            v-model="track.average_rating"
            :star-size="20"
            v-on:rating-selected="setRating($event, track)">
          </star-rating>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex shrink>
          <v-btn
            icon
            flat
            v-on:click.stop="onFavouriteTrack(track)">
            <v-icon medium :color="track.is_favourite_of_current_user? 'red' : 'grey'">
              favorite
            </v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
import mixins from '../mixins.js'
import StarRating from 'vue-star-rating'

export default {
  name: 'Track',
  props: {
    user: Object
  },
  data () {
    return {
      trackId: null,
      track: null
    }
  },
  components: {
    StarRating
  },
  watch: {
    user (val, oldval) {
      this.getTrackData()
    }
  },
  methods: {
    async getTrackData () {
      if (this.trackId) {
        const path = process.env.API_BASE_URL + `api/tracks/${this.trackId}`
        if (this.user) {
          const idToken = await this.user.getIdToken(true)
          await axios.get(path, {
            headers: { 'Authorization': 'bearer ' + idToken }
          })
            .then(response => {
              this.track = response.data
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          await axios.get(path)
            .then(response => {
              this.track = response.data
            })
            .catch(error => {
              console.log(error)
            })
        }
      }
    },
    onPlay () {
      this.$emit('play-track', this.trackId)
    },
    onSetRating (rating, track) {
      this.setRating(rating, track).then(() => {
        this.getTrackData()
      })
    },
    onFavouriteTrack (track) {
      this.setFavourite(track).then(() => {
        this.getTrackData()
      })
    }
  },
  mixins: [
    mixins
  ],
  created () {
    this.trackId = parseInt(this.$route.params.id)
    this.getTrackData()
  }
}
</script>

<style scoped>
h3.track-title {
  text-align: left;
}
h4.artist-name {
  font-size: 18px;
  text-align: left;
  color: darkgrey;
}
.artist-image {
  flex-grow: 0;
  margin-right: 5px;
}
</style>
