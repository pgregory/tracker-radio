<template>
  <b-card :title="artist.name"
          :img-src="getRandomAvatar()"
          img-alt="Image"
          img-top
          no-body
          style="min-width: 10rem"
          border-variant="light"
          class="artist mb-2 mx-1"
          v-on:click="click">
    {{ artist.name }}
  </b-card>
  <!--<b-container class="artist-container" v-on:click="click">
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
  </b-container>-->
</template>

<script>
export default {
  props: {
    artist: Object,
    empty: Boolean
  },
  methods: {
    click () {
      this.$gtm.trackEvent({
        event: 'artist-selected',
        action: 'select',
        category: 'Artist',
        label: 'Artist Selected',
        artist_id: this.artist.id
      })
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
  /*border: 2px solid rgb(0,255,0);
  height: 100%;
  flex-basis: auto;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  -moz-box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  box-shadow: 0px 0px 20px 6px rgba(0,128,0,1);
  background-color: #212529;
  display: flex;
  flex-direction: column;
  align-items: center;*/
  box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08);
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
