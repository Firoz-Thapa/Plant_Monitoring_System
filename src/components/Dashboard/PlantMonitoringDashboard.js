// src/components/Dashboard/PlantMonitoringDashboard.js
import React, { useState, useEffect } from 'react';
import SensorCard from './SensorCard';
import AlertNotification from '../Notifications/AlertNotification';
import SensorGraph from '../Graphs/SensorGraph';
import { Droplets } from 'lucide-react';
import { database } from '../../firebaseConfig';
import { ref, onValue, off } from "firebase/database";

const PlantMonitoringDashboard = () => {
  const [sensorData, setSensorData] = useState({
    moisture: 0,
    historicalData: [],
  });

  useEffect(() => {
    // Create a reference to the moisture data in Firebase Realtime Database
    const moistureRef = ref(database, 'sensorData/moisture');
    
    // Set up a real-time listener on the moisture data
    const unsubscribe = onValue(moistureRef, (snapshot) => {
      const moisture = snapshot.val();
      
      // Update sensorData with the new moisture value and add it to historical data
      setSensorData((prev) => ({
        ...prev,
        moisture,
        historicalData: [...prev.historicalData, {
          time: new Date().toLocaleTimeString(),
          moisture,
        }].slice(-10)  // Keep only the last 10 entries for the graph
      }));
    });

    // Cleanup listener when component is unmounted
    return () => {
      off(moistureRef, 'value', unsubscribe);
    };
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">🌱 Plant Monitoring System</h1>
      
      {/* Display the sensor card for moisture data */}
      <div className="grid grid-cols-1 gap-6">
        <SensorCard 
          title="Soil Moisture" 
          icon={<Droplets className="text-blue-500 w-6 h-6" />}
          value={`${sensorData.moisture.toFixed(1)}%`}
          status={sensorData.moisture < 30 ? 'Low' : sensorData.moisture < 70 ? 'Optimal' : 'High'}
        />
      </div>
      
      {/* Display the historical data graph */}
      <SensorGraph data={sensorData.historicalData} />
      
      {/* Display any relevant notifications */}
      <AlertNotification moisture={sensorData.moisture} />
    </div>
  );
};

export default PlantMonitoringDashboard;
