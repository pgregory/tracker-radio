<template>
  <b-container class="artist-container" v-on:click="click">
    <b-container class="artist" v-bind:class="{ empty: empty }">
      <b-row class="artist-name">
        <span v-if="artist">
          {{ artist.name }}
        </span>
      </b-row>
      <b-row class="artist-image">
        <div class="artist-image-container">
          <b-img v-if="artist" v-bind:src="getRandomAvatar()"></b-img>
        </div>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
export default {
  props: {
    artist: Object,
    empty: Boolean
  },
  methods: {
    click () {
      this.$emit('artist-selected')
    },
    getRandomAvatar () {
      var index = Math.ceil(Math.random() * 6)
      var strIndex = ('000' + index).slice(-3)
      return `/static/cover-${strIndex}.png`
    }
  }
}
</script>

<style scoped>
.artist {
  border: 2px solid rgb(0,255,0);
  width: 200px;
  height: 100%;
  flex-basis: auto;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  -moz-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  background-color: #212529;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.artist.empty {
  background-color: lightslategrey;
}
.artist-name {
  color: white;
  flex-shrink: 0;
}
.artist-image {
  flex: auto;
  display: flex;
  min-height: 0;
  width: 100%;
}
.artist-image-container {
  padding: 5px;
  flex: auto;
  width: 100%;
}
.artist-image-container img {
  height: 132px;
  border-radius: 25%;
}
</style>
