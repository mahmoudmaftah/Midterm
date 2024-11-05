<template>
    <div class="auth-container">
      <h1>{{ isSignIn ? 'Welcome Back!' : 'Join Us!' }}</h1>
      
      <transition name="fade" mode="out-in">
        <component 
          :is="isSignIn ? 'SignIn' : 'SignUp'" 
          @error="handleError" 
          v-bind="formProps" 
          :key="isSignIn ? 'signin' : 'signup'"  
        />
      </transition>
  
      <p class="toggle-text" @click="toggleForm">
        {{ isSignIn ? 'Don’t have an account? Sign Up' : 'Already have an account? Sign In' }}
      </p>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import SignIn from '@/components/auth2/login.vue'; // Adjust the path as necessary
  import SignUp from '@/components/auth2/signup.vue'; // Adjust the path as necessary
  
  export default {
    components: {
      SignIn,
      SignUp,
    },
    setup() {
      const isSignIn = ref(true);
      const formData = ref({}); // To hold the cached form data
      const errorMessage = ref('');
  
      // Watch for changes to the form data and cache it
      const formProps = ref({});
  
      watch(formData, (newVal) => {
        formProps.value = newVal;
      }, { deep: true });
  
      const toggleForm = () => {
        isSignIn.value = !isSignIn.value;
        errorMessage.value = ''; // Reset error message on toggle
      };
  
      const handleError = (message) => {
        errorMessage.value = message;
      };
  
      return {
        isSignIn,
        toggleForm,
        handleError,
        errorMessage,
        formProps,
        formData,
      };
    },
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .toggle-text {
    color: #007bff;
    cursor: pointer;
    text-align: center;
    margin-top: 20px;
    transition: color 0.2s;
  }
  
  .toggle-text:hover {
    color: #0056b3;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  </style>
  