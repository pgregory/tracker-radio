<template>
  <div class="player-container">
    <v-layout column fill-height>
      <v-progress-linear v-if="loading" class="ma-0" color="blue" indeterminate></v-progress-linear>
      <div v-else style="height: 7px;"></div>
      <v-container fill-height my-1 py-1>
        <v-layout row fill-height>
          <v-flex sm4>
            <v-layout fill-height v-if="track">
              <v-flex class="artist-image">
                <v-img width="80" height="80" :src="getRandomAvatar(track.artist.id)"></v-img>
              </v-flex>
              <v-flex>
                <v-layout column>
                  <h3 class="track-title">{{ track.title }}</h3>
                  <router-link :to="{ name: 'artist', params: { id: track.artist.id } }">
                    <h4 class="artist-name">{{ track.artist.name }}</h4>
                  </router-link>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex sm4>
            <v-btn
              v-bind:disabled="track == null"
              v-on:click="loadSong(track)"
              icon
              flat>
              <v-icon x-large>play_circle_filled</v-icon>
            </v-btn>
            <v-btn
              v-bind:disabled="track == null"
              v-on:click="stopSong"
              icon
              flat>
              <v-icon x-large>stop</v-icon>
            </v-btn>
          </v-flex>
          <v-flex sm2></v-flex>
          <v-flex sm2 ref="monitor-container">
            <canvas ref="monitor" width="10" height="10" class="monitor-canvas"></canvas>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </div>
</template>

<script>
import axios from 'axios'

import { state } from 'wetracker/state'
import { song } from 'wetracker/utils/songmanager'
import { player } from 'wetracker/audio/player'
import { connect } from 'wetracker/utils/signal'
import tinygradient from 'tinygradient'
import mixins from '../mixins.js'

export default {
  data () {
    return {
      track: null,
      analyzerColors: null,
      loading: false
    }
  },
  props: {
    user: Object,
    trackId: Number
  },
  mixins: [
    mixins
  ],
  watch: {
    trackId (val, oldval) {
      this.trackId = val
      this.getTrackData().then(() => {
        this.loadSong(this.track)
      })
    }
  },
  methods: {
    async getTrackData () {
      if (this.trackId) {
        const path = process.env.API_BASE_URL + `api/tracks/${this.trackId}`
        await axios.get(path)
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
    loadSong (track) {
      this.$gtm.trackEvent({
        event: 'track-play',
        action: 'play',
        category: 'Track',
        label: 'Play Track',
        track_id: track.id
      })
      this.loading = true
      var url = this.getTrackLocation(track)
      player.stop()
      song.downloadSong(url).then(() => {
        player.startPlaying()
        this.loading = false
      })
    },
    stopSong () {
      this.$gtm.trackEvent({
        event: 'track-stop',
        action: 'stop',
        category: 'Track',
        label: 'Stop Track',
        track_id: this.trackId
      })
      player.stop()
    },
    onTracksChanged (tracks) {
      this.renderMonitors(tracks)
    },
    renderMonitors (e) {
      const canvas = this.$refs['monitor']
      // const numBars = 32
      if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false })
        const HEIGHT = canvas.height
        const WIDTH = canvas.width
        const topHeight = HEIGHT * 0.75

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        if (e && 'masterScope' in e && 'scopeData' in e.masterScope) {
          // const cho2 = canvas.height / 2
          const freqData = e.masterScope.freqData
          const bufferLength = e.masterScope.bufferLength
          const barWidth = (WIDTH / bufferLength)

          if (this.analyzerColors == null) {
            const analyzerGradient = tinygradient([
              '#ff0000',
              '#ff00ff'
            ])
            this.analyzerColors = analyzerGradient.hsv(bufferLength)
          }

          let x = 0
          for (let i = 0; i < bufferLength; i += 1) {
            let barHeight = ((freqData[i] / 255) * topHeight) * 0.8
            let col = this.analyzerColors[i].clone()
            ctx.fillStyle = col.toHexString()
            ctx.fillRect(x, topHeight - barHeight, barWidth * 0.9, barHeight)
            ctx.fillStyle = col.darken(20).toHexString()
            ctx.fillRect(x, topHeight, barWidth * 0.9, barHeight / 3)
            x += barWidth
          }
        }
      }
    }
  },
  created () {
    this.getTrackData()
    connect(player, 'tracksChanged', this, 'onTracksChanged')
  },
  mounted () {
    var canvas = this.$refs['monitor']
    var container = this.$refs['monitor-container']
    // canvas.width = canvas.offsetWidth
    // canvas.height = canvas.offsetHeight
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
    canvas.style.width = container.offsetWidth
    canvas.style.height = container.offsetHeight
    state.set({
      transport: {
        masterVolume: -10.0
      }
    })
    this.renderMonitors()
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
.player-container {
  width: 100%;
  height: 100%;
}
</style>
