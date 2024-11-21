#import urequests
import time
#import network
#from machine import Pin, ADC
import config  # Import Wi-Fi credentials from config.py

# Influx DB Realtime Database URL

INFLUXDB="http://localhost:8086"

# Moisture sensor setup (ADC on Pin 26)
moisture_sensor = ADC(Pin(26))

# Connect to Wi-Fi
def connect_to_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(config.SSID, config.PASSWORD)  # Use credentials from config.py
    
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
        response = urequests.patch("http://localhost:8086", json=data)
        response.close()
        print("Data sent to Influx DB:", data)
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

# Main loop
def main():
    # Connect to Wi-Fi
    connect_to_wifi()
    
    # Calibrate the sensor to get dry and wet values
    dry_value, wet_value = calibrate_sensor()

    # Main loop to read and send moisture data
    while True:
        # Read the raw moisture level
        moisture_raw = moisture_sensor.read_u16()
        
        # Calculate the moisture percentage based on calibration values
        moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
        # Clamp the moisture value to be within 0-100%
        moisture_value = max(0, min(100, round(moisture_value, 2)))
        
        print("Moisture Level:", moisture_value, "%")  # Print moisture level
        
        # Send data to Firebase
        send_data(moisture_value)
        
        # Delay between readings (e.g., every 10 seconds)
        time.sleep(10)


main()