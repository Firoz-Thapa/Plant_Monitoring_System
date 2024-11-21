import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// InfluxDB configuration
const url = 'http://localhost:8086';
const token = 'XCatDggVjAP3fISlHktNZHvZ51M-pnKHpvD34r4S7G5GytF5Fy_cUr4jxftUzE2UVv4o2nccSzXxasIiruwEMA==';
const org = 'LAB';
const bucket = 'plant-monitoring-system';

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

// Express app setup
const app = express();
const server = createServer(app);

// WebSocket server setup
const wss = new WebSocketServer({ server });

// Array to store the last 10 moisture readings
const moistureReadings = [];

// Function to write dummy moisture data to InfluxDB
function writeDummyData() {
  const moisture = Math.random() * 100; // Random moisture value between 0 and 100
  const timestamp = new Date();
  const point = new Point('moisture')
    .floatField('value', moisture)
    .timestamp(timestamp);

  writeApi.writePoint(point);
  console.log(`Wrote moisture data: ${moisture}`);

  // Add the new reading to the array
  moistureReadings.push({ timestamp, value: moisture });
  
  // Keep only the last 10 readings
  if (moistureReadings.length > 10) {
    moistureReadings.shift();
  }
}

// Function to read the latest moisture data from InfluxDB
async function getMoistureData() {
  const fluxQuery = `
    from(bucket:"${bucket}")
      |> range(start: -1h)
      |> filter(fn: (r) => r._measurement == "moisture")
      |> last()
  `;

  try {
    const result = await queryApi.collectRows(fluxQuery);
    if (result.length > 0) {
      return result.map(row => ({
        timestamp: row._time,
        value: row._value
      }));
    }
    return [];
  } catch (error) {
    console.error('Error querying InfluxDB:', error);
    return [];
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send the current moisture readings immediately upon connection
  ws.send(JSON.stringify(moistureReadings));

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Interval to write dummy data to InfluxDB and update moistureReadings
setInterval(() => {
  writeDummyData();
  // Broadcast the updated moisture readings to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(moistureReadings));
    }
  });
}, 5000);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});