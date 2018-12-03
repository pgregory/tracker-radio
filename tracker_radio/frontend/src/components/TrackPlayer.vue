<template>
  <b-container id="track">
    <b-row id="track-player-title">
      <b-col>
        <p>Playing</p>
      </b-col>
    </b-row>
    <b-container id="track-player">
      <b-container class="track-player-inner">
        <b-row>
          <div class="transport-container">
            <b-button v-bind:disabled="track == null" v-on:click="loadSong(track)">Play</b-button>
            <b-button v-bind:disabled="track == null" v-on:click="stopSong">Stop</b-button>
          </div>
        </b-row>
        <b-row id="monitors">
          <div class="monitor-container">
            <div class="monitor-border"></div>
            <canvas ref="monitor" style="width:100%;height:100%;" class="monitor-canvas"></canvas>
          </div>
        </b-row>
      </b-container>
    </b-container>
  </b-container>
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
      var url = this.getTrackLocation(track)
      player.stop()
      song.downloadSong(url).then(() => {
        player.startPlaying()
      })
    },
    stopSong () {
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
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
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
#track-player-title {
  flex-shrink: 0;
}
#track-player  {
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
#track-player .track-player-inner  {
  flex: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.track-title {
  color: white;
  font-size: 28px;
}
.monitor-container, .transport-container {
  margin: 10px;
  position: relative;
  width: 100%;
}
.monitor-container {
  background-color: black;
}
#monitors {
  flex: auto;
}
.monitor-border {
  position: absolute;
  border-radius: 5px;
  border: 2px solid rgb(0,255,0);
  -webkit-box-shadow: inset 0px 0px 10px 3px rgba(0,128,0,1);
  -moz-box-shadow: inset 0px 0px 10px 3px rgba(0,128,0,1);
  box-shadow: inset 0px 0px 10px 3px rgba(0,128,0,1);
  width: 100%;
  height: 100%;
}
.monitor-container canvas {
  border-radius: 5px;
}
</style>
