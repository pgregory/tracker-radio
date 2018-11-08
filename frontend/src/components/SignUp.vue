<template>
  <div class="login">
    <h1>Sign Up</h1>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// Firebase log-in widget
function configureFirebaseLoginWidget () {
  var uiConfig = {
    'signInSuccessUrl': '/',
    'signInOptions': [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url
    'tosUrl': '<your-tos-url>'
  }

  var ui = new firebaseui.auth.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', uiConfig)
}

// Firebase log-in
function configureFirebaseLogin () {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user)
      // $('#logged-out').hide();
      // var name = user.displayName

      /* If the provider gives a display name, use the name for the
      personal welcome message. Otherwise, use the user's email. */
      // var welcomeName = name ? name : user.email

      user.getIdToken().then(function (idToken) {
        console.log('Logged in ' + idToken)
        // userIdToken = idToken

        /* Now that the user is authenicated, fetch the notes. */
        // fetchNotes();

        // $('#user').text(welcomeName)
        // $('#logged-in').show()
      })
    } else {
      // $('#logged-in').hide()
      // $('#logged-out').show()
      console.log('Logged out')
    }
  })
}

configureFirebaseLogin()
configureFirebaseLoginWidget()

export default {
  data: function () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
