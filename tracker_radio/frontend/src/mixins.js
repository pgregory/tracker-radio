export default {
  methods: {
    seededRandom: function (seed, min, max) {
      max = max || 1
      min = min || 0

      const rndSeed = (seed * 9301 + 49297) % 233280
      const rnd = rndSeed / 233280

      return min + rnd * (max - min)
    },
    getRandomAvatar (id) {
      var index = Math.ceil(this.seededRandom(id, 0, 6))
      var strIndex = ('000' + index).slice(-3)
      return `/static/cover-${strIndex}.png`
    }
  }
}
