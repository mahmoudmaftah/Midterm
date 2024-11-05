// src/composables/useAuth.js
import { getAuth, signOut } from "firebase/auth";

export function useAuth() {
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully.");
        // Optionally, redirect to the login page or show a confirmation message
        window.location.href = "/login"; // Adjust the path as needed
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return { logout };
}