<template>
  <div class="user-profile">
    <h2>User Profile</h2>
    <div v-if="user">
      <img :src="user.photoURL" alt="Profile Picture" v-if="user.photoURL" />
      <p><strong>Name:</strong> <input v-model="displayName" /></p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Bio:</strong> <input v-model="bio" /></p>
      <p><strong>Location:</strong> <input v-model="location" /></p>
      <div class="button-group">
        <button @click="updateProfile" :disabled="loading">{{ loading ? 'Updating...' : 'Update Profile' }}</button>
        <button @click="logoutUser">Logout</button>
      </div>
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/init";
import { useAuth } from "@/composables/useAuth";

export default {
  name: "UserProfile",
  setup() {
    const loading = ref(false);
    const user = ref(null);
    const displayName = ref("");
    const bio = ref("");
    const location = ref("");
    const auth = getAuth();
    const { logout } = useAuth();

    onMounted(() => {
      onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          user.value = authUser;
          displayName.value = authUser.displayName || "";
          await fetchUserProfileData(authUser.uid);
        }
      });
    });

    const fetchUserProfileData = async (uid) => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          bio.value = userData.bio || "";
          location.value = userData.location || "";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const updateProfile = async () => {
  // Prevent multiple submissions
  if (loading.value) return;

  loading.value = true; // Set loading state

  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName.value,
      });
    }

    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        bio: bio.value,
        location: location.value,
      });

      alert("Profile updated successfully!");
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating the profile.");
  } finally {
    loading.value = false; // Reset loading state
  }
};

    const logoutUser = () => {
      logout();
    };

    return { user, displayName, bio, location, updateProfile, logoutUser };
  },
};
</script>

<style scoped>
.user-profile {
  text-align: center;
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
.user-profile img {
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin-bottom: 15px;
}
input {
  display: block;
  width: calc(100% - 10px);
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}
input:focus {
  border-color: #007bff;
  outline: none;
}
.button-group {
  display: flex;
  justify-content: space-between;
}
button {
  flex: 1;
  margin: 5px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>
