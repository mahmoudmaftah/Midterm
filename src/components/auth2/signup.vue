<template>
    <form @submit.prevent="signUp">
      <h2>Signup Form</h2>
  
      <!-- Username Field -->
      <input type="text" placeholder="Username" required v-model="username" />
  
      <!-- Email Field -->
      <input type="email" placeholder="Email" required v-model="email" />
  
      <!-- Password Field with Strength Indicator -->
      <input
        type="password"
        placeholder="Password"
        required
        v-model="password"
        @input="checkPasswordStrength"
      />
      <div :class="passwordStrengthClass">{{ passwordStrengthMessage }}</div>
  
      <!-- Predefined Profile Picture Selection -->
      <h3>Select a Profile Picture</h3>
      <div class="profile-pictures">
        <img
          v-for="(pic, index) in profilePictures"
          :key="index"
          :src="pic"
          :class="{ selected: selectedProfilePicture === pic }"
          @click="selectProfilePicture(pic)"
          alt="Profile Option"
        />
      </div>
  
      <!-- Profile Customization Fields -->
      <input type="text" placeholder="Bio" v-model="bio" />
      <input type="text" placeholder="Location" v-model="location" />
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  
      <button type="submit">Signup</button>
    </form>
  </template>
  
  <script>
  import { ref } from 'vue'
  import { db, auth } from '@/firebase/init' // Assume Firebase init file is configured
  import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
  import { collection, addDoc } from 'firebase/firestore'
  
  export default {
    setup() {
      const username = ref('')
      const email = ref('')
      const password = ref('')
      const bio = ref('')
      const location = ref('')
      const selectedProfilePicture = ref('')
      const errorMessage = ref('')
      const passwordStrengthMessage = ref('')
      const passwordStrengthClass = ref('')
  
      // List of predefined profile picture URLs
      const profilePictures = ref([
        'https://th.bing.com/th/id/OIP.C4BtIPNC5Q-MjW8dhE2dvQHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.1&pid=1.7',
        'https://th.bing.com/th/id/OIP.djHPIpCTodv5ttec9oXcpwHaHa?w=195&h=196&c=7&r=0&o=5&dpr=1.1&pid=1.7',
        'https://th.bing.com/th/id/OIP.k1MhwGlJm0Mh5gH43er2EQHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.1&pid=1.7',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXiNpYO73Jg9QTnl2xJyxguvtW3DBZwTJIkw&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy2H3PKpPHNDzyq4k_DgA_N0VvSyN9lMs9lrM4e4txpi1BFyALSdVDv8jrgz5Evhbp-hw&usqp=CAU'
        // Add more URLs as needed
      ])
  
      // Select profile picture function
      const selectProfilePicture = (pic) => {
        selectedProfilePicture.value = pic
      }
  
      // Password strength check
      const checkPasswordStrength = () => {
        const strength = password.value.length
        if (strength >= 8) {
          passwordStrengthMessage.value = 'Strong'
          passwordStrengthClass.value = 'strong'
        } else if (strength >= 5) {
          passwordStrengthMessage.value = 'Moderate'
          passwordStrengthClass.value = 'moderate'
        } else {
          passwordStrengthMessage.value = 'Weak'
          passwordStrengthClass.value = 'weak'
        }
      }
  
  
      // Sign Up Function
      const signUp = async () => {
        errorMessage.value = ''
  
        try {
          // Create the user
          const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
          const user = userCredential.user
  
          // Update User Profile with display name, bio, location, and selected profile picture
          await updateProfile(user, {
            displayName: username.value,
            photoURL: selectedProfilePicture.value
          })
  
          // Store additional info in Firestore (bio, location)
          await addDoc(collection(db, 'users'), {
            uid: user.uid,
            bio: bio.value,
            location: location.value,
          })

          console.log("User signed up and all information updated succesfully!")
        } catch (error) {
          console.error(error.message)
          errorMessage.value = 'An error occurred during signup. Please try again.'
        }
      }
  
      return {
        username,
        email,
        password,
        bio,
        location,
        profilePictures,
        selectedProfilePicture,
        errorMessage,
        passwordStrengthMessage,
        passwordStrengthClass,
        signUp,
        selectProfilePicture,
        checkPasswordStrength
      }
    }
  }
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  .strong {
    color: green;
  }
  .moderate {
    color: orange;
  }
  .weak {
    color: red;
  }
  .profile-pictures {
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .profile-pictures img {
    width: 50px;
    height: 50px;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 50%;
    margin: 40px;

  }
  .profile-pictures img.selected {
    border-color: blue;
  }
  
  .form-bottom {
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 15px;
  }
  
  input,
  select,
  button {
    font-size: 1rem;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  
  }
  
  .error {
    color: red;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .profile-pictures img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 50%;
  }
  
  .profile-pictures img.selected {
    border: 2px solid #007bff;
  }
  
  
  form {
    max-width: 800px;
    display: flex;
    flex-direction: column;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    
  }
  
  
  </style>
  