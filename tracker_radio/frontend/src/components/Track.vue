// Track.vue

<template>
  <div id="content">
    <b-container id="track-panel">
      <b-row>
        <b-col sm="6">
          <TrackData v-bind:trackId="trackId" v-bind:user="user"/>
        </b-col>
        <b-col sm="6">
          <TrackPlayer v-bind:trackId="trackId" v-bind:user="user"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import TrackData from './TrackData.vue'
import TrackPlayer from './TrackPlayer.vue'

export default {
  name: 'Track',
  props: {
    user: Object
  },
  data () {
    return {
      trackId: null
    }
  },
  methods: {
  },
  components: {
    TrackData,
    TrackPlayer
  },
  created () {
    this.trackId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  flex: auto;
  min-height: 0;
}
#track-panel {
  flex: auto;
  display: flex;
  flex-direction: row;
  min-height: 0;
  margin-bottom: 10px;
  margin-top: 10px;
}
#track-panel .row {
  flex: auto;
}
.panel {
  height: 100%;
}
</style>
