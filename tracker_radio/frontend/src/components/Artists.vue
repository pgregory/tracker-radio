// Artists.vue

<template>
  <div id="content">
    <b-container id="artists-panel">
      <b-row id="artists-title" class="panel-title">
        <b-col>
          <span>Artists</span>
        </b-col>
      </b-row>
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
        <b-card-group deck class="artist-list d-flex flex-nowrap mx-0">
            <artist v-for="(artist, index) in filteredArtists()" ref="artist" v-bind:key="artist.id" :data-index="index" :artist="artist" v-on:artist-selected="artistId = artist.id"/>
        </b-card-group>
      </b-row>
      <div id="prev-button" v-on:click="scrollRight"><font-awesome-icon icon="chevron-left" size="1x"/></div>
      <div id="next-button" v-on:click="scrollLeft"><font-awesome-icon icon="chevron-right" size="1x"/></div>
    </b-container>
    <b-container id="track-panel">
      <b-row>
        <b-col sm="4">
          <TrackList v-bind:artistId="artistId" v-bind:user="user" v-on:track-selected="trackId = $event"/>
        </b-col>
        <b-col sm="4">
          <TrackData v-bind:trackId="trackId" v-bind:user="user"/>
        </b-col>
        <b-col sm="4">
          <TrackPlayer v-bind:trackId="trackId" v-bind:user="user"/>
        </b-col>
      </b-row>
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
    outerWidth (el) {
      var width = el.offsetWidth
      var style = getComputedStyle(el)

      width += parseInt(style.marginLeft) + parseInt(style.marginRight)
      return width
    },
    scrollLeft () {
      var itemWidth = this.outerWidth(this.$refs['artist'][0].$el)
      var scrollCount = Math.floor(this.$refs['artists'].offsetWidth / itemWidth)
      var currentFirst = Math.floor(this.$refs['artists'].scrollLeft / itemWidth)
      var target = Math.min(currentFirst + scrollCount, this.$refs['artist'].length)
      var targetElement = document.querySelector(`.artist[data-index="${target}"]`)
      var options = {
        container: this.$refs['artists'],
        easing: 'ease-in-out',
        force: true,
        x: true,
        y: false
      }
      VueScrollTo.scrollTo(targetElement, 500, options)
    },
    scrollRight () {
      var itemWidth = this.outerWidth(this.$refs['artist'][0].$el)
      var scrollCount = Math.floor(this.$refs['artists'].offsetWidth / itemWidth)
      var currentFirst = Math.floor(this.$refs['artists'].scrollLeft / itemWidth)
      var target = Math.max(currentFirst - scrollCount, 0)
      var targetElement = document.querySelector(`.artist[data-index="${target}"]`)
      var options = {
        container: this.$refs['artists'],
        easing: 'ease-in-out',
        force: true,
        x: true,
        y: false
      }
      VueScrollTo.scrollTo(targetElement, 500, options)
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
#artists-panel {
  flex: none;
  position: relative;
  background-color: #fafafa;
}
#artists-panel .row {
  overflow-x: auto;
  flex-wrap: nowrap;
}
#artists-title {
  font-size: 20px;
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
  background-color: white;
}
.letter.active {
  background-color: darkgrey;
}
.letter span {
  white-space: nowrap;
}
#artists-panel .row.artists {
  min-height: 200px;
  padding-bottom: 10px;
  padding-top: 10px;
}
#prev-button, #next-button {
  position: absolute;
  top: 50%;
  font-size: 10px;
  color: rgba(64,64,64,1.0);
  background-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  margin: auto;
  width: 3rem;
  height: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#prev-button {
  left: 5px;
}
#next-button {
  right: 5px;
}
.artist {
  min-width: 200px;
  /* margin: 5px; */
  max-width: 200px;
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
  margin-bottom: 10px;
}
#track-panel .row {
  flex: auto;
}
.panel {
  height: 100%;
}
</style>
