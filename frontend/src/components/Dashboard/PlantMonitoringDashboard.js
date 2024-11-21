import React, { useState, useEffect } from 'react';
import SensorGraph from '../Graphs/SensorGraph';
import AlertNotification from '../Notifications/AlertNotification';
import { Droplets } from 'lucide-react';
import SensorCard from './SensorCard';

const PlantMonitoringDashboard = () => {

    const [moistureData, setMoistureData] = useState([]);

    useEffect(() => {
      const ws = new WebSocket('ws://localhost:3001');

      ws.onopen = () => {
        console.log('Connected to WebSocket server');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const formattedData = data.map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          moisture: parseFloat(item.value.toFixed(2)),
        }));
        setMoistureData(formattedData);
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
      };

      return () => {
        ws.close();
      };
    }, []);
  const latestMoisture = moistureData.length > 0 ? moistureData[moistureData.length - 1].moisture : null;
  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Low';
    if (moisture < 70) return 'Optimal';
    return 'High';
  };
  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">🌱 Plant Monitoring System</h1>
      
    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SensorCard 
          title="Soil Moisture" 
          icon={<Droplets className="text-blue-500 w-6 h-6" />}
          value={`${latestMoisture !== null ? latestMoisture.toFixed(1) : "0.0"}%`}
          status={latestMoisture !== null ? getMoistureStatus(latestMoisture) : 'Low'}
        />
        {latestMoisture !== null && <AlertNotification moisture={latestMoisture} />}
      </div>
      
      <SensorGraph data={moistureData} />

    </div>
  );
};

export default PlantMonitoringDashboard;
