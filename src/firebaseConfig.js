import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  

const firebaseConfig = {
  apiKey: "AIzaSyC5dpYtJ_zdQ7Ub8XrJ-S8ITGq5S0WaiFg",
  authDomain: "plant-monitoring-system-6ef51.firebaseapp.com",
  databaseURL: "https://plant-monitoring-system-6ef51-default-rtdb.europe-west1.firebasedatabase.app",  // Add this line for Realtime Database
  projectId: "plant-monitoring-system-6ef51",
  storageBucket: "plant-monitoring-system-6ef51.appspot.com",
  messagingSenderId: "1073278823268",
  appId: "1:1073278823268:web:3ce9f3d68c1b31a6c32871",
  measurementId: "G-RWRCK18E82"
};
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);  

export { database };
