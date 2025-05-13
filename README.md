# 🌱 Plant Monitoring System

A complete IoT solution for monitoring plant soil moisture in real-time, with data visualization and alerts.

## Overview

This plant monitoring system consists of three main components:

1. **Hardware**: A Raspberry Pi Pico with a soil moisture sensor and ST7735 LCD display
2. **Backend**: Node.js server with Express, WebSockets, and InfluxDB for time-series data storage
3. **Frontend**: React web application for real-time monitoring and visualization

The system monitors soil moisture levels in real-time, stores historical data, and provides alerts when your plants need watering.

## Features

- **Real-time monitoring** of soil moisture levels
- **Historical data visualization** with time-series charts
- **Automatic alerts** when moisture levels are too low
- **Responsive web dashboard** accessible from any device
- **WebSocket communication** for instant updates
- **InfluxDB integration** for efficient time-series data storage


## Hardware Requirements

- Raspberry Pi Pico (or compatible microcontroller)
- Capacitive soil moisture sensor
- ST7735 LCD display (optional for standalone operation)
- Power supply
- Breadboard and jumper wires

## Setup Instructions

### Hardware Setup

1. Connect the soil moisture sensor to the Raspberry Pi Pico (ADC0/Pin 26)

### MicroPython Setup

1. Flash MicroPython to your Raspberry Pi Pico
2. Configure Wi-Fi and InfluxDB settings in `moisture.py`:
   ```python
   ssid = "YOUR_WIFI_SSID"
   password = "YOUR_WIFI_PASSWORD"
   INFLUXDB_URL = "YOUR_INFLUXDB_URL"
   INFLUXDB_BUCKET = "YOUR_BUCKET"
   INFLUXDB_ORG = "YOUR_ORG"
   INFLUXDB_TOKEN = "YOUR_TOKEN"
      ```
    
3. Copy `moisture.py` to the Pico

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend

2. Create a .env file with your InfluxDB settings:  
 ``` bash
 INFLUX_URL=YOUR_INFLUXDB_URL
INFLUX_TOKEN=YOUR_INFLUXDB_TOKEN
INFLUX_ORG=YOUR_INFLUXDB_ORG
INFLUX_BUCKET=YOUR_INFLUXDB_BUCKET
PORT=3001
 ```
3. Install dependencies and start the server: 
    ``` bash
    npm install
    npm run dev
   ```

 
### Frontend Setup
1. Navigate to the frontend directory:
   ``` bash
   cd frontend
   ```

2. Install dependencies and start the development server:
```bash
npm install
npm start
```


### Demonstration

## Demo

Scan this QR code to watch the demo:

![QR Code to Video](https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://youtu.be/1gQZejyTcGo)

Or visit: [Plant Monitoring System Demo](https://youtu.be/1gQZejyTcGo)
