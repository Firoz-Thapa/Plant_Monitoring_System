import React, { useState, useEffect, useRef } from 'react';
import SensorGraph from '../Graphs/SensorGraph';
import AlertNotification from '../Notifications/AlertNotification';
import { Droplets } from 'lucide-react';
import SensorCard from './SensorCard';

const getMoistureStatus = (moisture) => {
  if (moisture < 30) return 'Low';
  if (moisture > 70) return 'High';
  return 'Optimal';
};

const PlantMonitoringDashboard = () => {
  const [moistureData, setMoistureData] = useState([]);
  const [latestMoisture, setLatestMoisture] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);

      // Fetch historical data on WebSocket connection
      fetch('http://localhost:3001/api/moisture/history')
        .then((response) => response.json())
        .then((data) => {
          const formattedData = data.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString(),
            moisture: parseFloat(item.value.toFixed(2)),
          }));
          setMoistureData(formattedData);

          // Set the latest moisture value
          if (formattedData.length > 0) {
            setLatestMoisture(formattedData[formattedData.length - 1].moisture);
          }
        })
        .catch((err) => {
          console.error('Error fetching historical data:', err);
          setError('Failed to load historical data');
        });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setLatestMoisture(data.value);

        setMoistureData((prev) => {
          const newTime = new Date(data.timestamp).toLocaleTimeString();
          return [...prev, { time: newTime, moisture: parseFloat(data.value.toFixed(2)) }].slice(-20);
        });
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
        setError('Error processing data');
      }
    };

    ws.onclose = () => {
      console.warn('WebSocket disconnected');
      setIsConnected(false);

      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket connection error');
      ws.close();
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-8 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">🌱 Plant Monitoring System</h1>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SensorCard
          title="Soil Moisture"
          icon={<Droplets className="text-blue-500 w-6 h-6" />}
          value={`${latestMoisture !== null ? latestMoisture.toFixed(1) : '0.0'}%`}
          status={latestMoisture !== null ? getMoistureStatus(latestMoisture) : 'Loading...'}
        />
        {latestMoisture !== null && <AlertNotification moisture={latestMoisture} />}
      </div>

      <SensorGraph data={moistureData} />

      <div className={`text-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
        {isConnected ? 'Connected to server' : 'Disconnected from server'}
      </div>
    </div>
  );
};

export default PlantMonitoringDashboard;
