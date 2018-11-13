// Artists.vue

<template>
  <div id="content">
    <b-container id="artists">
      <p>Artists</p>
      <b-row class="letters">
        <b-col class="letter" v-bind:class="{ active:  letter == current_letter }" v-on:click="selectLetter(letter)" v-for="letter in letters" v-bind:key="letter">
          <span>{{ letter }}</span>
        </b-col>
      </b-row>
      <b-row class="search">
        <b-form-input v-model="search_string" type="text" placeholder="Search"></b-form-input>
        <b-button :variant="primary" v-on:click="search_string = ''">X</b-button>
      </b-row>
      <b-row class="artists">
        <b-col class="artist" v-for="artist in filteredArtists()" v-bind:key="artist.id">
          <div class="dummy"></div>
          <artist v-bind:artist="artist" v-on:artist-selected="updateArtistTracks(artist.id)"/>
        </b-col>
        <template v-if="filteredArtists().length < 5">
        <b-col class="artist empty" v-for="n in (5 - filteredArtists().length)" v-bind:key="n">
          <div class="dummy"></div>
          <artist empty/>
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
            <a :href="getTrackLocation(data.item)" target="_blank">Play</a>
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
      track_fields: [ 'title', 'artist', 'coop', 'location' ],
      letters: ['All', '0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      current_letter: 'A',
      search_string: ''
    }
  },
  methods: {
    filteredArtists () {
      var searchString = this.search_string.toLowerCase()
      return this.artists.filter(function (artist) {
        return artist.name.toLowerCase().indexOf(searchString) !== -1
      })
    },
    getArtistsFromBackend () {
      const path = process.env.API_BASE_URL + `api/artists`
      axios.get(path, {
        params: {
          letter: this.current_letter
        }
      })
        .then(response => {
          this.artists = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    getArtists () {
      this.artists = []
      this.tracks = []
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
      this.tracks = []
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
    },
    selectLetter (letter) {
      this.current_letter = letter
      this.getArtists()
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
  overflow-x: auto;
  flex-wrap: nowrap;
}
#artists .row.artists {
  min-height: 200px;
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
.letter {
  border: 1px solid black;
  min-width: 0;
  height: 100%;
  flex-basis: auto;
  border-radius: 5px;
  -webkit-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  -moz-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  padding-right: 0;
  padding-left: 0;
}
.letter.active {
  background-color: darkseagreen;
}
.letter span {
  white-space: nowrap;
}
</style>
