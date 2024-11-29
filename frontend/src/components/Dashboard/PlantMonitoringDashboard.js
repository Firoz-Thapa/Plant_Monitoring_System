/*import React, { useState, useEffect } from 'react';
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
*/

import React, { useState, useEffect } from 'react';
import SensorGraph from '../Graphs/SensorGraph'; // Import the graph component
import AlertNotification from '../Notifications/AlertNotification'; // Import alert notifications
import { Droplets } from 'lucide-react'; // Import the icon
import SensorCard from './SensorCard'; // Import the reusable SensorCard component

const PlantMonitoringDashboard = () => {
  const [moistureData, setMoistureData] = useState([]); // Historical and real-time moisture data
  const [latestMoisture, setLatestMoisture] = useState(null); // Latest moisture value
  const [error, setError] = useState(null); // Error handling

  // Fetch historical data from the backend
  const fetchHistoricalData = async () => {
    try {
      const response = await fetch('/api/moisture/history');
      const data = await response.json();
      const formattedData = data.map((item) => ({
        time: new Date(item.timestamp).toLocaleTimeString(),
        moisture: parseFloat(item.value.toFixed(2)),
      }));
      setMoistureData(formattedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
    }
  };

  // Fetch real-time data using WebSocket
  useEffect(() => {
    fetchHistoricalData();

    const ws = new WebSocket('ws://localhost:3001'); // Connect to the WebSocket
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data); // Parse WebSocket data
        if (data.value !== undefined) {
          setLatestMoisture(data.value);

          const formattedData = {
            time: new Date(data.timestamp).toLocaleTimeString(),
            moisture: parseFloat(data.value.toFixed(2)),
          };
          setMoistureData((prev) => [...prev, formattedData].slice(-10)); // Keep the last 10 readings
        }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    ws.onerror = () => {
      console.error('WebSocket connection failed');
      setError('WebSocket connection failed');
    };

    ws.onclose = () => {
      console.warn('WebSocket connection closed');
    };

    return () => ws.close();
  }, []);

  // Helper function to determine moisture status
  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return 'Low';
    if (moisture > 70) return 'High';
    return 'Optimal';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 text-gray-800">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">🌱 Plant Monitoring System</h1>

      {/* Sensor Card and Alert Notification */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SensorCard
          title="Soil Moisture"
          icon={<Droplets className="text-blue-500 w-6 h-6" />}
          value={`${latestMoisture !== null ? latestMoisture.toFixed(1) : "0.0"}%`}
          status={latestMoisture !== null ? getMoistureStatus(latestMoisture) : 'Loading...'}
        />
        {latestMoisture !== null && <AlertNotification moisture={latestMoisture} />}
      </div>

      {/* Moisture History Graph */}
      <SensorGraph data={moistureData} />
    </div>
  );
};

export default PlantMonitoringDashboard;
