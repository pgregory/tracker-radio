// Artists.vue

<template>
  <v-container id="content">
    <div id="artists-panel">
      <v-layout row justify-center>
        <h2>Artists</h2>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex xs6>
          <v-text-field
            v-model="search_string"
            hint="Search within current set"
            placeholder="Search"
            clearable>
          </v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-chip dark small v-bind:class="{ active:  letter == current_letter }" v-on:click="selectLetter(letter)" v-for="letter in letters" v-bind:key="letter">
              <span>{{ letter }}</span>
          </v-chip>
        </v-flex>
      </v-layout>
      <v-container grid-list-lg>
        <v-layout row wrap ref="artists">
          <v-flex v-for="(artist, index) in filteredArtists()" ref="artist" v-bind:key="artist.id" :data-index="index" >
            <v-card
              hover
              width="150"
              height="100%"
              v-on:click="onArtistSelected(artist.id)">
              <v-img :src="getRandomAvatar(artist.id)">
              </v-img>
              <v-card-title>
                {{ artist.name }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import axios from 'axios'
import mixins from '../mixins.js'
// import VueScrollTo from 'vue-scrollto'

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
    onArtistSelected (artistId) {
      this.$router.push({ path: `/artists/${artistId}` })
    }
  },
  components: {
  },
  mixins: [
    mixins
  ],
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
#artists-panel .row.artists {
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
