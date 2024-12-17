# 🌱 Plant Monitoring System

The **Plant Monitoring System** is an IoT solution designed to monitor the health of plants by collecting environmental data such as soil moisture. This system ensures efficient plant care by providing real-time data visualization.

## 🛠️ Key Features

- **Sensor Integration:** Collects soil moisture data using sensors.
- **IoT Communication:** Sends collected data to the cloud via HTTP POST requests.
- **Backend Processing:** A robust Node.js backend processes and stores data in a database.
- **Data Visualization:** Real-time data visualization through a user-friendly web interface.
- **Cost-Effective:** Utilizes affordable components like Raspberry Pi and open-source tools.


## 🔧 Technologies Used

### Embedded Device:
- **MicroPython** on Raspberry Pi Pico W: Captures and sends sensor data and send it to the backend server.

### Backend:
- **Node.js 23+:** Handles backend logic and API Routes.
- **Express.js:** Simplified routing and middleware for the server.
- **InfluxDB:** Stores time-series data for efficient querying and visualization.

### Frontend:
- **React:** Modern and responsive dashboard for visualizing sensor data.
- **Chart.js:** For interactive and real-time graph visualizations.
- **Tailwind CSS:** For a sleek, customizable UI design.

### Cloud Platform:
- **Ubuntu 24.04 LTS VPS:** Cloud server for hosting the backend and frontend.
- **Nginx:** Reverse proxy and static file serving.

## 🚀 Getting Started

### Prerequisites
1. A Raspberry Pi Pico W with MicroPython installed.
2. Soil moisture sensor (Compatible with Raspberry pi).
3. VPS with Ubuntu 24.04 LTS (or compatible system).
4. Installed software:
   - Node.js 23 or later
   - InfluxDB v2.7.10
   - Nginx v1.24.0
   - Docker(optional for containerization)

### Setup Instructions

#### 1. Embedded Device
- Connect the sensors (soil moisture sensor) to the Raspberry Pi Pico W.
- Upload the MicroPython script from the `Python/` folder to the device.
- Update the script's endpoint URL to match your backend server.
 ```bash
  endpoint = "http://<YOUR_SERVER_IP>:3001/moisture"
```
- Run the Script

#### 2. Backend
- Navigate to the `backend/` folder:
  ```bash
  cd backend
  npm install
  node server.js

- Ensure the backend is running on port 3001.

### 3. Frontend
Place the frontend files on your server or serve them through Nginx:

```bash
sudo cp -r frontend/* /var/www/html/
sudo systemctl restart nginx
```


### 4. Database

Configure InfluxDB to accept data from the backend and provide visualization tools.


### 5. Test the system

- Send the test data from the Raspberry pi pico w.
- Open the web interface in a browser to view thedata.

### 5. **Database Configuration**

### 1. Install InfluxDB

Update your package lists and install InfluxDB:

```bash
sudo apt update
sudo apt install influxdb
```

### 1. Start InfluxDB Service
```bash
sudo systemctl start influxdb
sudo systemctl enable influxdb
```
### 3. Configure InfluxDB
```Bash
   http://<YOUR_SERVER_IP>:8086
```
### 6. 📊 Dashboard Preview
Link to the Web site : http://20.238.28.249/
The dashboard displays: 
- Real-Time Soil Moisture with graphs.
- Historical data for the past hour.
- Alerts for low or high moisture levels.


### 7. 🐳 **Optional: Docker Deployment**

#### **Build and Run with Docker Compose**

1. **Navigate to Project Root:**

   ```bash
   cd plant_monitoring_system```
2. **Start Services:**
   ```bash
   docker-compose up --build```

2. **Access the Dashboard:**
   Visit the dashboard at :
   ```http://<YOUR_SERVER_IP>:3000```


## 8. 📜 License

This project is licensed under the **[MIT License](https://opensource.org/licenses/MIT)**.  
See the [LICENSE](LICENSE) file for more details.


 
