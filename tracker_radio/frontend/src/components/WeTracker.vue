// WeTracker.vue

<template>
  <v-tooltip bottom>
    <a slot="activator"
      :href="getTrackLocation(track)" target="_blank">
      <v-hover>
        <v-img src="/static/logo_small.png"
          width="80px"
          slot-scope="{ hover }"
          :class="`wetracker-logo elevation-${hover ? 12 : 2}`">
        </v-img>
      </v-hover>
    </a>
    <span>Open track in WeTracker</span>
  </v-tooltip>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    getTrackLocation (track) {
      const playerRoot = 'http://app.wetracker.xyz/#/loadsong?url='
      var url = encodeURI('https://modland.com/pub/modules/Fasttracker 2/' + track.location)
      return playerRoot + url
    }
  },
  props: {
    user: Object,
    track: Object
  }
}
</script>

<style scoped>
.wetracker-logo {
  background: black;
  border-radius: 5px;
  border: 9px solid black;
}
</style>
