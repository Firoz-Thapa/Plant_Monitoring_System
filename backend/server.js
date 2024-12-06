import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

const url = 'http://localhost:8086'; 
const token = 'XCatDggVjAP3fISlHktNZHvZ51M-pnKHpvD34r4S7G5GytF5Fy_cUr4jxftUzE2UVv4o2nccSzXxasIiruwEMA==';
const org = 'LAB'; 
const bucket = 'plant-monitoring-system'; 

const client = new InfluxDB({ url, token });
const writeApi = client.getWriteApi(org, bucket);
const queryApi = client.getQueryApi(org);

const app = express();
app.use(express.json()); 


const server = createServer(app);
const wss = new WebSocketServer({ server });


let latestMoisture = null;


app.post('/moisture', (req, res) => {
  const { value } = req.body;

  if (value !== undefined) {
    try {

      const point = new Point('moisture')
        .floatField('value', value)
        .timestamp(new Date());
      writeApi.writePoint(point);

      console.log(`Data written to InfluxDB: ${value}`);


      latestMoisture = { value, timestamp: new Date() };

     
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

app.get('/api/moisture', (req, res) => {
  if (latestMoisture) {
    res.status(200).json(latestMoisture);
  } else {
    res.status(200).json({ message: 'No data available' });
  }
});

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

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});