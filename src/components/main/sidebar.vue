<template>
    <nav class="navbar">
        <div class="navbar-brand">
            <h2>Welcome, {{ username }}</h2>
        </div>

        <!-- User Info Section -->
        <div class="user-info">
            <img :src="profilePicUrl" alt="Profile Picture" v-if="profilePicUrl" class="profile-pic" />
            <div class="user-details">
                <p v-if="bio" class="user-text">Bio: {{ bio }}</p>
                <p v-if="location" class="user-text">Location: {{ location }}</p>
            </div>
        </div>

        <ul class="nav-links">
            <li>
                <router-link to="/home">
                    <i class="fas fa-home"></i> Home
                </router-link>
            </li>
            <li>
                <router-link to="/about">
                    <i class="fas fa-info-circle"></i> About
                </router-link>
            </li>
            <li>
                <router-link to="/profile">
                    <i class="fas fa-user"></i> Profile
                </router-link>
            </li>
            <li>
                <a @click.prevent="logout" class="logout-link">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
import { useAuth } from "@/composables/useAuth";
import { auth, db } from "@/firebase/init";
import { doc, getDoc } from 'firebase/firestore';

export default {
    data() {
        return {
            username: "",
            profilePicUrl: "",
            bio: "",
            location: "",
        };
    },
    methods: {
        logout() {
            const { logout } = useAuth();
            logout();
        },
    },
    mounted() {
        this.username = auth.currentUser?.displayName;
        this.profilePicUrl = auth.currentUser?.photoURL;

        const userDocRef = doc(db, "users", auth.currentUser?.uid);
        getDoc(userDocRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    this.bio = data.bio;
                    this.location = data.location;
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    },
};
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 15px 30px;
    border-bottom: 3px solid #34495e;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Ensure it stays above other content */
    
}


.navbar-brand h2 {
    font-size: 1.8rem;
    margin: 0;
    color: #ecdbff;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-details .user-text {
    color: #bdc3c7;
    margin: 0;
    font-size: 0.9rem;
}

.profile-pic {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #ecf0f1;
}

.nav-links {
    display: flex;
    gap: 20px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.nav-links li a {
    color: #ecf0f1;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s;
}

.nav-links li a:hover {
    color: #e67e22;
}

.logout-link {
    cursor: pointer;
    color: #e74c3c;
    font-weight: bold;
}

.logout-link:hover {
    color: #c0392b;
}
</style>
