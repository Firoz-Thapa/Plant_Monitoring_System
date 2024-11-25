# 🌱 Plant Monitoring System

The **Plant Monitoring System** is an IoT solution designed to monitor the health of plants by collecting environmental data such as temperature, humidity, and soil moisture. This system ensures efficient plant care by providing real-time data visualization and actionable insights.

## 🛠️ Key Features

- **Sensor Integration:** Collects temperature, humidity, and soil moisture data using sensors.
- **IoT Communication:** Sends collected data to the cloud via HTTP POST requests.
- **Backend Processing:** A robust Node.js backend processes and stores data in a database.
- **Data Visualization:** Real-time data visualization through a user-friendly web interface.
- **Cost-Effective:** Utilizes affordable components like Raspberry Pi and open-source tools.


## 🔧 Technologies Used

### Embedded Device:
- **MicroPython** on Raspberry Pi Pico W: Captures and sends sensor data.

### Backend:
- **Node.js:** Backend logic for processing incoming IoT data.
- **Express.js:** Handles API routes for receiving and serving data.
- **Database:** InfluxDB for time-series data storage.

### Frontend:
- **HTML/CSS/JavaScript:** A simple and responsive dashboard for visualizing data.

### Cloud Platform:
- **Virtual Private Server (VPS):** Hosted on an Ubuntu 24.04 LTS instance.
- **Nginx:** For managing HTTP traffic and serving the frontend.

## 🚀 Getting Started

### Prerequisites
1. A Raspberry Pi Pico W with MicroPython installed.
2. VPS with Ubuntu 24.04 LTS (or compatible system).
3. Installed software:
   - Node.js 23 or later
   - InfluxDB v2.7.10
   - Nginx v1.24.0

### Setup

#### 1. Embedded Device
- Connect the sensors (soil moisture sensor) to the Raspberry Pi Pico W.
- Upload the MicroPython script from the `Python/` folder to the device.
- Update the script's endpoint URL to match your backend server.

#### 2. Backend
- Navigate to the `backend/` folder:
  ```bash
  cd backend
  npm install
  node app.js

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

### 6. 📊 Dashboard Preview

The dashboard displays: 
- Soil moisture levels
- Alerts for critical conditions


 