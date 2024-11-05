<template>
  <div id="app">
    <!-- Only show router-view if the user is authenticated -->
    <router-view v-if="isAuthenticated" />
    <!-- Show Auth component if user is not authenticated -->
    <Auth v-else />
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/init"; // Ensure this is your Firebase configuration file
import Auth from "@/views/auth.vue";

export default {
  name: "App",
  components: {
    Auth,
  },
  data() {
    return {
      isAuthenticated: false, // Track authentication status
    };
  },
  created() {
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, set isAuthenticated to true
        console.log(user)
        this.isAuthenticated = true;
        this.$router.push( "Home" );
      } else {
        // No user signed in, set isAuthenticated to false
        this.isAuthenticated = false;
        // Redirect to login/signup page if logged out
        this.$router.push("Auth" );
      }
    });
  },
};
</script>

<style>
/* Add any relevant styles here */
</style>
