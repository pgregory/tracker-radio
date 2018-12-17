// Playlists.vue

<template>
  <div id="content">
    <b-container v-if="user != null" id="playlists-panel">
      <b-row>
        <b-col sm="8" class="lists">
          <b-row class="playlists">
            <b-col sm="12">
              <PlaylistList allow-edit="true" v-bind:user="user" v-on:playlist-selected="playlistId = $event"/>
            </b-col>
          </b-row>
          <b-row class="tracks">
            <b-col sm="12">
              <PlaylistTrackList v-bind:playlistId="playlistId" v-bind:user="user" v-on:track-selected="trackId = $event"/>
            </b-col>
          </b-row>
        </b-col>
        <b-col sm="4">
          <TrackPlayer v-bind:trackId="trackId" v-bind:user="user"/>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-else>
      <b-jumbotron header="Playlists">
        <p>To use playlists, login or sign up using the link at the right of the navigation bar above.</p>
      </b-jumbotron>
    </b-container>
  </div>
</template>

<script>
import PlaylistList from './PlaylistList.vue'
import PlaylistTrackList from './PlaylistTrackList.vue'
import TrackPlayer from './TrackPlayer.vue'

export default {
  name: 'Playlists',
  props: {
    user: Object
  },
  data () {
    return {
      playlistId: null,
      trackId: null
    }
  },
  methods: {
  },
  components: {
    PlaylistList,
    PlaylistTrackList,
    TrackPlayer
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
#playlists-panel {
  flex: auto;
  display: flex;
  flex-direction: row;
  min-height: 0;
  margin-bottom: 10px;
  margin-top: 10px;
}
#playlists-panel .row {
  flex: auto;
}
.lists {
  display: flex;
  flex-direction: column;
}
#playlists-panel .lists .row {
  flex: 1;
}
.lists .row.playlists {
  margin-bottom: 10px;
}
.lists .row.tracks {
  margin-top: 10px;
}
.panel {
  height: 100%;
}
</style>
