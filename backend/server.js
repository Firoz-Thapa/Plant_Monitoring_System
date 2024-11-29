//import express from 'express';
//import { createServer } from 'http';
//import { WebSocketServer } from 'ws';
//import { InfluxDB, Point } from '@influxdata/influxdb-client';
//
//// InfluxDB configuration
//const url = 'http://localhost:8086';
//const token = 'Your token';
//const org = 'LAB';
//const bucket = 'plant-monitoring-system';
//
//const client = new InfluxDB({ url, token });
//const writeApi = client.getWriteApi(org, bucket);
//const queryApi = client.getQueryApi(org);
//
//// Express app setup
//const app = express();
//const server = createServer(app);
//
//// WebSocket server setup
//const wss = new WebSocketServer({ server });
//
//// Array to store the last 10 moisture readings
//const moistureReadings = [];
//
//// Function to write dummy moisture data to InfluxDB
//function writeDummyData() {
//  const moisture = Math.random() * 100; // Random moisture value between 0 and 100
//  const timestamp = new Date();
//  const point = new Point('moisture')
//    .floatField('value', moisture)
//    .timestamp(timestamp);
//
//  writeApi.writePoint(point);
//  console.log(`Wrote moisture data: ${moisture}`);
//
//  // Add the new reading to the array
//  moistureReadings.push({ timestamp, value: moisture });
//  
//  // Keep only the last 10 readings
//  if (moistureReadings.length > 10) {
//    moistureReadings.shift();
//  }
//}
//
//// Function to read the latest moisture data from InfluxDB
//async function getMoistureData() {
//  const fluxQuery = `
//    from(bucket:"${bucket}")
//      |> range(start: -1h)
//      |> filter(fn: (r) => r._measurement == "moisture")
//      |> last()
//  `;
//
//  try {
//    const result = await queryApi.collectRows(fluxQuery);
//    if (result.length > 0) {
//      return result.map(row => ({
//        timestamp: row._time,
//        value: row._value
//      }));
//    }
//    return [];
//  } catch (error) {
//    console.error('Error querying InfluxDB:', error);
//    return [];
//  }
//}
//
//// WebSocket connection handler
//wss.on('connection', (ws) => {
//  console.log('Client connected');
//
//  // Send the current moisture readings immediately upon connection
//  ws.send(JSON.stringify(moistureReadings));
//
//  ws.on('close', () => {
//    console.log('Client disconnected');
//  });
//});
//
//// Interval to write dummy data to InfluxDB and update moistureReadings
//setInterval(() => {
//  writeDummyData();
//  // Broadcast the updated moisture readings to all connected clients
//  wss.clients.forEach((client) => {
//    if (client.readyState === WebSocket.OPEN) {
//      client.send(JSON.stringify(moistureReadings));
//    }
//  });
//}, 5000);
//
//// Start the server
//const PORT = process.env.PORT || 3001;
//server.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
//});


import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

// InfluxDB Configuration
const url = 'http://localhost:8086'; // Replace with your InfluxDB URL
const token = 'Yourtoken'; // Replace with your token
const org = 'LAB'; // Replace with your organization name
const bucket = 'plant-monitoring-system'; // Replace with your bucket name

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// WebSocket setup
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store the latest moisture value for broadcasting
let latestMoisture = null;

// Endpoint to receive sensor data
app.post('/moisture', (req, res) => {
  const { value } = req.body;

  if (value !== undefined) {
    try {
      // Write the data to InfluxDB
      const point = new Point('moisture')
        .floatField('value', value)
        .timestamp(new Date());
      writeApi.writePoint(point);

      console.log(`Data written to InfluxDB: ${value}`);

      // Update the latest moisture value
      latestMoisture = { value, timestamp: new Date() };

      // Broadcast the updated value to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(latestMoisture));
        }
      });

      res.status(200).send({ message: 'Data received and written to InfluxDB' });
    } catch (error) {
      console.error('Error writing to InfluxDB:', error);
      res.status(500).send({ error: 'Failed to write data to InfluxDB' });
    }
  } else {
    res.status(400).send({ error: 'Invalid data format' });
  }
});

// Endpoint to fetch the latest data
app.get('/api/moisture', (req, res) => {
  if (latestMoisture) {
    res.status(200).json(latestMoisture);
  } else {
    res.status(200).json({ message: 'No data available' });
  }
});

// Endpoint to fetch historical data
app.get('/api/moisture/history', async (req, res) => {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h) // Adjust as needed
      |> filter(fn: (r) => r._measurement == "moisture")
      |> sort(columns: ["_time"], desc: false)
  `;

  try {
    const rows = [];
    await queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        rows.push(tableMeta.toObject(row));
      },
      error(err) {
        console.error(err);
        res.status(500).send('Failed to query InfluxDB');
      },
      complete() {
        res.status(200).json(rows.map((row) => ({
          timestamp: row._time,
          value: row._value,
        })));
      },
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).send('Internal server error');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
