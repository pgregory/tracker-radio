<template>
  <b-container id="track">
    <b-row id="track-data-title">
      <b-col>
        <p>Track</p>
      </b-col>
    </b-row>
    <b-container id="track-data">
      <b-container class="track-data-inner" v-if="track">
        <b-row>
          <p class="track-title">{{track.title}}</p>
        </b-row>
        <b-row>
          <star-rating v-model="track.average_rating" v-bind:star-size="20" v-bind:read-only="user == null"
            v-on:rating-selected="setRating($event, track.id)"></star-rating>
        </b-row>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'
import firebase from 'firebase'

export default {
  data () {
    return {
      track: null
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
        const path = process.env.API_BASE_URL + `api/tracks/${this.trackId}`
        axios.get(path)
          .then(response => {
            this.track = response.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    getTrackLocation (track) {
      var url = encodeURI('https://modland.com/pub/modules/Fasttracker 2/' + track.location)
      return url
    },
    setRating (rating, track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track + `/rate`
      const user = firebase.auth().currentUser
      if (user) {
        user.getIdToken(true).then(function (idToken) {
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
#track-data-title {
  flex-shrink: 0;
}
#track-data  {
  overflow-y: scroll;
  border: 2px solid rgb(0,255,0);
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  -moz-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  margin-bottom: 15px;
  flex: auto;
  background-color: #212529;
  padding: 0;
  display: flex;
  flex-direction: column;
}
#track-data .track-data-inner  {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.track-title {
  color: white;
  font-size: 28px;
}
.track-play {
  font-size: 48px;
}
</style>
