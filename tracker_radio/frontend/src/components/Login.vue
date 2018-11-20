<template>
  <div id="firebaseui-auth-container"></div>
</template>

<script>
import firebase from 'firebase'
import firebaseui from 'firebaseui'
// import {config} from '../helpers/firebaseConfig'
export default {
  name: 'login',
  mounted: function () {
    var uiConfig = {
      signInSuccessUrl: '/artists',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    ui.start('#firebaseui-auth-container', uiConfig)
  },
  data: function () {
    return {
    }
  }
}
</script>

<style scoped>
</style>
