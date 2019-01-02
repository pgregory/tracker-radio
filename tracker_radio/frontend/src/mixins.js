import axios from 'axios'
import firebase from 'firebase'

export default {
  methods: {
    seededRandom: function (seed, min, max) {
      max = max || 1
      min = min || 0

      const rndSeed = (seed * 9301 + 49297) % 233280
      const rnd = rndSeed / 233280

      return min + rnd * (max - min)
    },
    getRandomAvatar (id) {
      var index = Math.ceil(this.seededRandom(id, 0, 6))
      var strIndex = ('000' + index).slice(-3)
      return `/static/cover-${strIndex}.png`
    },
    async setFavourite (track) {
      let op = 'favourite'
      if (track.is_favourite_of_current_user) {
        op = 'unfavourite'
      }
      const path = process.env.API_BASE_URL + `api/tracks/${track.id}/${op}`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        const idToken = await user.getIdToken(true)
        self.$gtm.trackEvent({
          event: 'track-favourite',
          action: op,
          category: 'Track',
          label: 'Track Favourited',
          track_id: track.id
        })
        await axios.post(path, {},
          { headers: { 'Authorization': 'bearer ' + idToken } })
      }
    },
    async setRating (rating, track) {
      const path = process.env.API_BASE_URL + `api/tracks/` + track.id + `/rate`
      const user = firebase.auth().currentUser
      const self = this
      if (user) {
        const idToken = await user.getIdToken(true)
        self.$gtm.trackEvent({
          event: 'track-rate',
          action: 'rate',
          category: 'Track',
          label: 'Track Rated',
          track_id: track.id,
          rating: rating
        })
        await axios.post(path, {
          rating: rating
        }, { headers: { 'Authorization': 'bearer ' + idToken } })
      }
    },
    async getSingleTrackFromBackend (trackId) {
      const path = process.env.API_BASE_URL + `api/tracks/${trackId}`
      if (this.user) {
        // var self = this
        const idToken = await this.user.getIdToken(true)
        const res = await axios.get(path,
          { headers: { 'Authorization': 'bearer ' + idToken } })
        return res.data
      } else {
        const res = await axios.get(path)
        return res.data
      }
    }
  }
}
