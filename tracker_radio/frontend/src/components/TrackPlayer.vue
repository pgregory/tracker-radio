<template>
  <b-container id="track">
    <b-row id="track-player-title">
      <b-col>
        <p>Playing</p>
      </b-col>
    </b-row>
    <b-container id="track-player">
      <b-container class="track-player-inner" v-if="track">
        <b-row>
          <b-button v-on:click="loadSong(track)">Play</b-button>
          <b-button v-on:click="stopSong">Stop</b-button>
        </b-row>
        <b-row>
          <canvas ref="monitor" style="width:100%;height:100%;" class="monitor-canvas"></canvas>
        </b-row>
      </b-container>
    </b-container>
  </b-container>
</template>

<script>
import axios from 'axios'

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
      const ctx = canvas.getContext('2d', { alpha: false })

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0f0'
      ctx.strokeStyle = '#04AEF7'
      ctx.lineWidth = 1

      // volume in dB as a green bar
      // var vu_y = -Math.log(e.vu[j])*10;
      // ctx.fillRect(10, vu_y, 5, canvas.height-vu_y);

      const cho2 = canvas.height / 2

      if ('masterScope' in e && 'scopeData' in e.masterScope) {
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
  },
  created () {
    this.getTrackData()
    connect(player, 'tracksChanged', this, 'onTracksChanged')
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
  align-items: center;
}
.track-title {
  color: white;
  font-size: 28px;
}
</style>
