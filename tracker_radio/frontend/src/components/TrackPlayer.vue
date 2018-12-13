<template>
  <b-card id="playing"
          class="panel"
          no-body
          header="Playing">
    <b-card-body class="panel-body">
      <b-row no-gutters id="transport-row">
        <div>
          <b-button v-bind:disabled="track == null" v-on:click="loadSong(track)">Play</b-button>
          <b-button v-bind:disabled="track == null" v-on:click="stopSong">Stop</b-button>
        </div>
      </b-row>
      <b-row no-gutters id="monitors">
        <div ref="monitor-container" class="monitor-container">
          <canvas ref="monitor" width="10" height="10" class="monitor-canvas"></canvas>
        </div>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script>
import axios from 'axios'

import { state } from 'wetracker/state'
import { song } from 'wetracker/utils/songmanager'
import { player } from 'wetracker/audio/player'
import { connect } from 'wetracker/utils/signal'

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
    loadSong (track) {
      this.$gtm.trackEvent({
        event: 'track-play',
        action: 'play',
        category: 'Track',
        label: 'Play Track',
        track_id: track.id
      })
      var url = this.getTrackLocation(track)
      player.stop()
      song.downloadSong(url).then(() => {
        player.startPlaying()
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
      if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false })

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = '#080'
        ctx.lineWidth = 1
        const xBarIncrement = (canvas.width / 10.0)
        for (var x = 0; x < canvas.width; x += xBarIncrement) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        const yBarIncrement = (canvas.height / 10.0)
        for (var y = 0; y < canvas.height; y += yBarIncrement) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }

        if (e && 'masterScope' in e && 'scopeData' in e.masterScope) {
          ctx.fillStyle = '#0f0'
          ctx.strokeStyle = '#04AEF7'
          ctx.lineWidth = 2

          const cho2 = canvas.height / 2
          const scopeData = e.masterScope.scopeData
          const bufferLength = e.masterScope.bufferLength

          const sliceWidth = canvas.width * (1.0 / (bufferLength - 1))
          let x = 0
          let y = (scopeData[0] / 128.0) * cho2

          ctx.beginPath()
          ctx.moveTo(x, y)
          for (let i = 1; i < bufferLength; i += 1) {
            y = (scopeData[i] / 128.0) * cho2
            ctx.lineTo(x, y)
            x += sliceWidth
          }
          ctx.stroke()
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
    console.log(canvas.height)
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
.monitor-container, .transport-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.monitor-container {
  background-color: black;
  border: 3px solid lightgrey;
  border-radius: 5px;
}
#monitors {
  flex: auto;
  margin-top: 10px;
}
.monitor-container canvas {
  border-radius: 5px;
  height: 100%;
  width: 100%;
}
#transport-row {
  flex-shrink: 0;
}
.panel-body {
  display: flex;
  flex-direction: column;
}
</style>
