<template>
    <form @submit.prevent="signIn">
      <h2>Sign In</h2>
  
      <!-- Email Field -->
      <input type="email" placeholder="Email" required v-model="email" />
  
      <!-- Password Field -->
      <input
        type="password"
        placeholder="Password"
        required
        v-model="password"
      />
  
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  
      <button type="submit">Sign In</button>
    </form>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { auth, db } from '@/firebase/init'; // Ensure your Firebase init file is set up properly
  import { signInWithEmailAndPassword } from 'firebase/auth';
  import { collection, getDocs, query, where } from 'firebase/firestore'; // Added 'where' import
  

  import { useRouter } from 'vue-router';

  
  export default {
    setup() {
    const router = useRouter();


      const email = ref('');
      const password = ref('');
      const username = ref('');
      const bio = ref('');
      const location = ref('');
      const profilePicURL = ref('');
  
      const errorMessage = ref('');
  
      const signIn = async () => {
        try {
          await signInWithEmailAndPassword(auth, email.value, password.value);
          // Redirect or perform actions after successful sign-in
          username.value = auth.currentUser.displayName;
          profilePicURL.value = auth.currentUser.photoURL;
  
          const userDocRef = collection(db, 'users');
          const userQuery = query(userDocRef, where('uid', '==', auth.currentUser.uid)); // Renamed query to userQuery
  
          const userDocs = await getDocs(userQuery); // Changed from getDoc to getDocs
          if (!userDocs.empty) {
            const userData = userDocs.docs[0].data(); // Access the first document's data
            bio.value = userData.bio || '';
            location.value = userData.location || '';
  
            console.log(username.value);
            console.log(bio.value);
            console.log(location.value);
            console.log(profilePicURL.value);
          }
  
          console.log("User signed in!");
          router.push('/home');
        } catch (error) {
          errorMessage.value = error.message; // Display the error message
        }
      };
  
      return {
        email,
        password,
        errorMessage,
        signIn,
        username, // Included username, bio, location, profilePicURL in return
        bio,
        location,
        profilePicURL,
      };
    },
  };
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
  