// Artists.vue

<template>
  <v-container id="content" grid-list-md>
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
          <v-btn-toggle class="letters" v-model="selected_letter" mandatory>
            <v-btn
              v-for="letter in letters"
              v-bind:key="letter"
              :class="{ letter: true, active: letter == current_letter }"
              v-on:click="selectLetter(letter)"
              flat small>
              {{ letter }}
            </v-btn>
          </v-btn-toggle>
        </v-flex>
      </v-layout>
      <v-container grid-list-lg>
        <v-progress-linear v-if="loading" color="blue" indeterminate></v-progress-linear>
        <v-data-iterator
          :rows-per-page-items="rowsPerPageItems"
          :items="filteredArtists()"
          :loading="loading"
          :no-data-text="noDataMessage"
          content-tag="v-layout"
          row
          wrap>
          <v-flex slot="item" slot-scope="props">
            <v-card
              hover
              width="150"
              height="100%"
              v-on:click="onArtistSelected(props.item.id)">
              <v-img :src="getRandomAvatar(props.item.id)">
              </v-img>
              <v-card-title>
                {{ props.item.name }}
              </v-card-title>
            </v-card>
          </v-flex>
        </v-data-iterator>
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
      current_letter: 'All',
      selected_letter: 0,
      search_string: '',
      rowsPerPageItems: [25, 50, 100],
      loading: false,
      noDataMessage: "Loading Artists"
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
      this.loading = true;
      const path = process.env.API_BASE_URL + `api/artists`
      axios.get(path, {
        params: {
          letter: this.current_letter
        }
      })
        .then(response => {
          this.artists = response.data
          this.loading = false;
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
#artists-title {
  font-size: 20px;
}
.letter.active {
  background-color: darkgrey;
}
.letters {
  flex-wrap: wrap;
}
</style>
