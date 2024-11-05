<template>
    <div class="container">
      <navbar/>
      <addEvent/>
      <eventsList/>
    </div>

  </template>
  
  <script>
  import navbar from '@/components/main/sidebar.vue';



  import addEvent from '@/components/Voting/addEvent.vue';
  import eventsList from '@/components/Voting/eventsList.vue';


  import { auth, db } from "@/firebase/init";

  
  export default {
    components: {
      navbar, addEvent, eventsList
    },
    data() {
      return {
        currentArtisanId: auth.currentUser.uid,
      };
    },
    methods: {



    },
  };
  </script>
  
  <style scoped>

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    width: 100%;
    padding-top: 80px;
  }

  </style>
  