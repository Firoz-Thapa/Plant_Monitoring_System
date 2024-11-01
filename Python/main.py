# main.py

import urequests
import time
import network
from machine import Pin, ADC

# Wi-Fi Credentials
SSID = 'Firoz'         # Replace with your Wi-Fi network name
PASSWORD = 'Firoz12'   # Replace with your Wi-Fi password

# Firebase Realtime Database URL
FIREBASE_URL = 'https://plant-monitoring-system-6ef51-default-rtdb.firebaseio.com/sensorData.json'

# Moisture sensor setup (ADC on Pin 26)
moisture_sensor = ADC(Pin(26))

# Connect to Wi-Fi
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)  # Use embedded credentials
    
    # Wait until connection is established
    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        time.sleep(1)
    print("Connected to Wi-Fi:", wlan.ifconfig())

# Send data to Firebase
def send_data(moisture_value):
    data = {
        "moisture": moisture_value
    }
    try:
        # Use PATCH to update data at the specified node in Firebase
        response = urequests.patch(FIREBASE_URL, json=data)
        response.close()
        print("Data sent to Firebase:", data)
    except Exception as e:
        print("Failed to send data:", e)

# Calibration function
def calibrate_sensor():
    # Step 1: Measure dry value
    print("Make sure the sensor is in dry air (not touching anything).")
    time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
    dry_value = moisture_sensor.read_u16()
    print("Calibrated dry value (air):", dry_value)

    # Step 2: Measure wet value
    print("Place the sensor in water or wet soil, then wait...")
    time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
    wet_value = moisture_sensor.read_u16()
    print("Calibrated wet value (wet soil or water):", wet_value)

    return dry_value, wet_value

# Main function
def main():
    # Connect to Wi-Fi
    connect_to_wifi()
    
    # Calibrate the sensor to get dry and wet values
    dry_value, wet_value = calibrate_sensor()

    # Main loop to read, print, and send moisture data
    while True:
        # Read the raw moisture level
        moisture_raw = moisture_sensor.read_u16()
        
        # Calculate the moisture percentage based on calibration values
        moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
        # Clamp the moisture value to be within 0-100%
        moisture_value = max(0, min(100, round(moisture_value, 2)))
        
        # Print the moisture level in percentage
        print("Moisture Level:", moisture_value, "%")
        
        # Send data to Firebase
        send_data(moisture_value)
        
        # Delay between readings (e.g., every 10 seconds)
        time.sleep(10)

# Run the main function
main()