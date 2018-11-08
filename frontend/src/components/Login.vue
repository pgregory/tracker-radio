<template>
  <div class="login">
    <h1>Sign In</h1>
    <b-form-input type="text" placeholder="email"></b-form-input><br/>
    <b-form-input type="password" placeholder="Password"></b-form-input><br/>
    <b-button v-on:click="login">Login</b-button>
    <p>Don't have an account? You can <router-link to="/sign-up">create one</router-link></p>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
    }
  },
  methods: {
    login: function () {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
</style>
