<template>
  <b-card id="track"
          class="panel"
          no-body
          header="Track">
    <b-card-body class="track-data" v-if="track">
      <b-row no-gutters>
        <p class="track-title">{{track.title}}</p>
      </b-row>
      <b-row no-gutters class="ratings">
        <star-rating v-model="track.average_rating" v-bind:star-size="20" v-bind:read-only="user == null"
          v-on:rating-selected="setRating($event, track.id)"></star-rating>
        <font-awesome-icon icon="heart" size="lg" class="favourite" v-bind:class="{ is_favourite: isFavourite }"
          v-on:click="setFavourite(track.id)"
          v-b-tooltip.hover title="Favourite"/>
      </b-row>
      <b-row no-gutters class="wetracker">
        <a :href="getTrackLocation(track)" target="_blank">
          <b-img thumbnail src="/static/logo_small.png"
            width="80px"
            v-b-tooltip.hover title="Open in WeTracker"/>
        </a>
      </b-row>
      <router-link class="permalink" :to="'/track/' + track.id"><font-awesome-icon
          icon="link"
          size="lg"
          v-b-tooltip.hover title="Shareable Link"/></router-link>
    </b-card-body>
  </b-card>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'
import firebase from 'firebase'

export default {
  data () {
    return {
      track: null,
      isFavourite: false
    }
  },
  props: {
    user: Object,
    trackId: Number
  },
  watch: {
    trackId (val, oldval) {
      this.getTrackData()
    }
  },
  methods: {
    getTrackData () {
      if (this.trackId) {
        this.$gtm.trackEvent({
          event: 'track-selected',
          action: 'select',
          category: 'Track',
          label: 'Track Selected',
          track_id: this.trackId
        })
        const path = process.env.API_BASE_URL + `api/tracks/${this.trackId}`
        const favPath = process.env.API_BASE_URL + `api/tracks/${this.trackId}/favourite`
        axios.get(path)
          .then(response => {
            this.track = response.data
          })
          .catch(error => {
            console.log(error)
          })
        const user = firebase.auth().currentUser
        if (user) {
          var self = this
          user.getIdToken(true).then(function (idToken) {
            axios.get(favPath, { headers: { 'Authorization': 'bearer ' + idToken } })
              .then(response => {
                self.isFavourite = response.data['favourite']
              })
              .catch(error => {
                console.log(error)
              })
          })
        }
      }
    },
    getTrackLocation (track) {
      const playerRoot = 'http://app.wetracker.xyz/#/loadsong?play=1&url='
      var url = encodeURI('https://modland.com/pub/modules/Fasttracker 2/' + track.location)
      return playerRoot + url
    },
    setRating (rating, track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track + `/rate`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          self.$gtm.trackEvent({
            event: 'track-rate',
            action: 'rate',
            category: 'Track',
            label: 'Track Rated',
            track_id: track,
            rating: rating
          })
          axios.post(path, {
            rating: rating
          }, { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              console.log(response)
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    },
    setFavourite (track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track + `/favourite`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        user.getIdToken(true).then(function (idToken) {
          console.log(user)
          self.$gtm.trackEvent({
            event: 'track-favourite',
            action: 'favourite',
            category: 'Track',
            label: 'Track Favourited',
            track_id: track
          })
          axios.post(path, {},
            { headers: { 'Authorization': 'bearer ' + idToken } })
            .then(function (response) {
              self.isFavourite = true
            }).catch(function (error) {
              console.log(error)
            })
        })
      }
    }
  },
  components: {
    StarRating
  },
  created () {
    this.getTrackData()
  }
}
</script>

<style scoped>
.track-data {
  display: flex;
  flex-direction: column;
  position: relative;
}
.track-title {
  color: black;
  font-size: 28px;
}
.ratings {
  align-items: center;
  justify-content: space-around;
}
.favourite {
  color: grey;
}
.favourite:hover {
  color: salmon;
}
.favourite.is_favourite {
  color: red;
}
.permalink {
  position: absolute;
  right: 5px;
  top: 5px;
}
.wetracker {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.wetracker img {
  background-color: black;
}
</style>
