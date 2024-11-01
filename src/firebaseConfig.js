// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  // Import the Realtime Database
// import { getAnalytics } from "firebase/analytics"; // Optional, only if you want analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5dpYtJ_zdQ7Ub8XrJ-S8ITGq5S0WaiFg",
  authDomain: "plant-monitoring-system-6ef51.firebaseapp.com",
  databaseURL: "https://plant-monitoring-system-6ef51-default-rtdb.firebaseio.com",  // Add this line for Realtime Database
  projectId: "plant-monitoring-system-6ef51",
  storageBucket: "plant-monitoring-system-6ef51.appspot.com",
  messagingSenderId: "1073278823268",
  appId: "1:1073278823268:web:3ce9f3d68c1b31a6c32871",
  measurementId: "G-RWRCK18E82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
const database = getDatabase(app);  // Initialize the Realtime Database

// Optional: Initialize Analytics if you need it
// const analytics = getAnalytics(app);

export { database };
