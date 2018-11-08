<template>
  <div class="artist-container" v-on:click="click">
    <div class="artist">
      <span v-if="artist">
        {{ artist.name }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artist: Object
  },
  methods: {
    click: function () {
      console.log('Clicked!')
      this.$emit('artist-selected')
    }
  }
}
</script>

<style scoped>
.artist {
  border: 1px solid black;
  width: 200px;
  height: 100%;
  flex-basis: auto;
  border-radius: 5px;
  -webkit-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  -moz-box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
  box-shadow: 10px 10px 14px 0px rgba(0,0,0,0.14);
}
</style>
