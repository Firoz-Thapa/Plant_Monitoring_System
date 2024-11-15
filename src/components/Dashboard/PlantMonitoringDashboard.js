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
  
    const moistureRef = ref(database, 'sensorData/moisture');
    
    const unsubscribe = onValue(moistureRef, (snapshot) => {
      const moisture = snapshot.val() ?? 0; 
      

      setSensorData((prev) => ({
        ...prev,
        moisture,
        historicalData: [...prev.historicalData, {
          time: new Date().toLocaleTimeString(),
          moisture,
        }].slice(-10) 
      }));
    });


    return () => {
      off(moistureRef, 'value', unsubscribe);
    };
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">🌱 Plant Monitoring System</h1>
      
    
      <div className="grid grid-cols-1 gap-6">
        <SensorCard 
          title="Soil Moisture" 
          icon={<Droplets className="text-blue-500 w-6 h-6" />}
          value={`${sensorData.moisture !== null ? sensorData.moisture.toFixed(1) : "0.0"}%`}
          status={sensorData.moisture < 30 ? 'Low' : sensorData.moisture < 70 ? 'Optimal' : 'High'}
        />
      </div>
      
      <SensorGraph data={sensorData.historicalData} />
      

      <AlertNotification moisture={sensorData.moisture} />
    </div>
  );
};

export default PlantMonitoringDashboard;
