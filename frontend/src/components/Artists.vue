// Artists.vue

<template>
  <div id="content">
    <b-container id="artists">
      <p>Artists</p>
      <b-row>
        <b-col class="artist" v-for="artist in artists" v-bind:key="artist.id">
          <div class="dummy"></div>
          <artist v-bind:artist="artist" v-on:artist-selected="updateArtistTracks(artist.id)"/>
        </b-col>
        <template v-if="artists.length < 5">
        <b-col class="artist" v-for="n in (5 - artists.length)" v-bind:key="n">
          <div class="dummy"></div>
          <artist/>
        </b-col>
        </template>
      </b-row>
    </b-container>
    <b-container id="tracks">
      <b-row id="tracks-title">
        <b-col>
          <p>Tracks</p>
        </b-col>
      </b-row>
      <b-container id="track-list">
        <b-table striped hover :items="tracks" :fields="track_fields">
          <template slot="artist" slot-scope="data">
            {{ data.item.artist[0].name }}
          </template>
          <template slot="location" slot-scope="data">
            <a :href="getTrackLocation(data.item)">Play</a>
          </template>
        </b-table>
      </b-container>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import Artist from './Artist.vue'

export default {
  data () {
    return {
      artists: [],
      tracks: [],
      artist_id: '',
      track_fields: [ 'title', 'artist', 'coop', 'location' ]
    }
  },
  methods: {
    getArtistsFromBackend () {
      const path = process.env.API_BASE_URL + `api/artists`
      axios.get(path)
        .then(response => {
          this.artists = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getArtists () {
      this.getArtistsFromBackend()
    },
    getArtistTracksFromBackend () {
      if (this.artist_id) {
        const path = process.env.API_BASE_URL + `api/artists/` + this.artist_id + `/tracks`
        axios.get(path)
          .then(response => {
            this.tracks = response.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    getArtistTracks () {
      this.getArtistTracksFromBackend()
    },
    updateArtistTracks (artistId) {
      this.artist_id = artistId
      this.getArtistTracksFromBackend()
    },
    getTrackLocation (track) {
      const playerRoot = 'http://app.wetracker.xyz/#/loadsong?play=1&url='
      var url = encodeURI('https://modland.ziphoid.com/pub/modules/Fasttracker 2/' + track.location)
      return playerRoot + url
    }
  },
  components: {
    Artist
  },
  created () {
    this.getArtists()
    this.getArtistTracks()
  }
}
</script>

<style scoped>
#content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.dummy {
  margin-top: 100%;
}
#artists {
  flex: none;
}
#artists .row {
  min-height: 200px;
  overflow-x: auto;
  flex-wrap: nowrap;
}
.artist {
  min-width: 200px;
  margin: 5px;
}
.artist-container {
  position: absolute;
  top: 5px;
  bottom: 0;
  right: 0;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 15px;
  width: 100%;
}
#tracks {
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}
#tracks-title {
  flex-shrink: 0;
}
#track-list {
  overflow-y: scroll;
  border: 1px solid black;
  border-radius: 5px;
  -webkit-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  -moz-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  margin-bottom: 15px;
}
</style>
