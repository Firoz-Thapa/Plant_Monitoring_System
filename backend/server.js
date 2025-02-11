import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// InfluxDB Configuration
const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

const app = express();
app.use(express.json());
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });

// Maintain a more robust WebSocket connection handler
const clients = new Set();
let latestMoistureData = null;

// Periodic ping to keep connections alive
function noop() {}
function heartbeat() {
  this.isAlive = true;
}

const intervalCheck = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      ws.terminate();
      return;
    }

    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000); // Check every 30 seconds

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);

  clients.add(ws);
  console.log('New WebSocket client connected');

  // Send latest data if available
  if (latestMoistureData) {
    ws.send(JSON.stringify(latestMoistureData));
  }

  ws.on('close', () => {
    clients.delete(ws);
    console.log('WebSocket client disconnected');
  });
});

wss.on('close', () => {
  clearInterval(intervalCheck);
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Plant Monitoring System API');
});

// Route to post moisture data
app.post('/moisture', async (req, res) => {
  const { value } = req.body;
  if (value !== undefined) {
    try {
      const point = new Point('moisture')
        .floatField('value', value)
        .timestamp(new Date());

      await writeApi.writePoint(point);
      await writeApi.flush();

      console.log(`Data written to InfluxDB: ${value}`);

      // Update latest moisture data
      latestMoistureData = {
        value,
        timestamp: new Date().toISOString(),
      };

      // Broadcast to all connected WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          console.log(`Broadcasting data: ${JSON.stringify(latestMoistureData)}`);
          client.send(JSON.stringify(latestMoistureData));
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

// Route to fetch historical moisture data
app.get('/api/moisture/history', async (req, res) => {
  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
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
        console.error('Query error:', err);
        res.status(500).send({ error: 'Failed to query InfluxDB' });
      },
      complete() {
        res.status(200).json(rows.map((row) => ({
          timestamp: row._time,
          value: row._value,
        })));
      },
    });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
