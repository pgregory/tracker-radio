// Artists.vue

<template>
  <div id="content">
    <b-container id="artists-panel">
      <p>Artists</p>
      <b-row class="letters">
        <b-col class="letter" v-bind:class="{ active:  letter == current_letter }" v-on:click="selectLetter(letter)" v-for="letter in letters" v-bind:key="letter">
          <span>{{ letter }}</span>
        </b-col>
      </b-row>
      <b-row class="search">
        <b-form-input v-model="search_string" type="text" placeholder="Search"></b-form-input>
        <b-button v-on:click="search_string = ''">X</b-button>
      </b-row>
      <b-row ref="artists" class="artists">
        <b-col ref="artist" class="artist" v-for="artist in filteredArtists()" v-bind:key="artist.id">
          <!--<div class="dummy"></div>-->
          <artist v-bind:artist="artist" v-on:artist-selected="artistId = artist.id"/>
        </b-col>
        <template v-if="filteredArtists().length < 5">
        <b-col class="artist empty" v-for="n in (5 - filteredArtists().length)" v-bind:key="n">
          <div class="dummy"></div>
          <artist empty/>
        </b-col>
        </template>
      </b-row>
      <div id="prev-button" v-on:click="scrollLeft"><font-awesome-icon icon="chevron-circle-left" size="1x"/></div>
      <div id="next-button" v-on:click="scrollRight"><font-awesome-icon icon="chevron-circle-right" size="1x"/></div>
    </b-container>
    <b-container id="track-panel">
      <TrackList v-bind:artistId="artistId" v-bind:user="user" v-on:track-selected="trackId = $event"/>
      <TrackData v-bind:trackId="trackId" v-bind:user="user"/>
      <TrackPlayer v-bind:trackId="trackId" v-bind:user="user"/>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
import VueScrollTo from 'vue-scrollto'
import Artist from './Artist.vue'
import TrackList from './TrackList.vue'
import TrackData from './TrackData.vue'
import TrackPlayer from './TrackPlayer.vue'

export default {
  name: 'Artists',
  props: {
    user: Object
  },
  data () {
    return {
      artists: [],
      artistId: null,
      trackId: null,
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
    selectLetter (letter) {
      this.current_letter = letter
      this.getArtists()
    },
    scrollLeft () {
      var scrollCount = Math.floor(this.$refs['artists'].offsetWidth / 200)
      var currentFirst = Math.floor(this.$refs['artists'].scrollLeft / 200)
      var target = Math.min(currentFirst + scrollCount, this.$refs['artist'].length)
      var options = {
        container: this.$refs['artists'],
        easing: 'ease-in-out',
        force: true,
        x: true,
        y: false
      }
      VueScrollTo.scrollTo(this.$refs['artist'][target], 500, options)
    },
    scrollRight () {
      var scrollCount = Math.floor(this.$refs['artists'].offsetWidth / 200)
      var currentFirst = Math.floor(this.$refs['artists'].scrollLeft / 200)
      var target = Math.max(currentFirst - scrollCount, 0)
      var options = {
        container: this.$refs['artists'],
        easing: 'ease-in-out',
        force: true,
        x: true,
        y: false
      }
      VueScrollTo.scrollTo(this.$refs['artist'][target], 500, options)
    }
  },
  components: {
    Artist,
    TrackList,
    TrackData,
    TrackPlayer
  },
  created () {
    this.getArtists()
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
.dummy {
  margin-top: 100%;
}
#artists-panel {
  flex: none;
  position: relative;
}
#artists-panel .row {
  overflow-x: auto;
  flex-wrap: nowrap;
}
#artists-panel .row.artists {
  min-height: 200px;
}
#prev-button, #next-button {
  position: absolute;
  top: 50%;
  font-size: 50px;
  color: rgba(128,128,128,0.8);
  margin: auto;
}
#prev-button {
  left: -0.5em;
}
#next-button {
  right: -0.5em;
}
.artist {
  min-width: 200px;
  /* margin: 5px; */
}
.artist-container {
  position: absolute;
  top: 5px;
  bottom: 0;
  right: 0;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 0;
  width: 100%;
}
#track-panel {
  flex: auto;
  display: flex;
  flex-direction: row;
  min-height: 0;
}
#tracks, #track {
  flex: auto;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
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
  background-color: mintcream;
}
.letter.active {
  background-color: darkseagreen;
}
.letter span {
  white-space: nowrap;
}
</style>
