import time
from machine import Pin, ADC

# Initialize the moisture sensor on Pin 26 (ADC0)
moisture_sensor = ADC(Pin(26))

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

# Main loop to read and print moisture levels based on calibration
while True:
    # Read the raw moisture level (range 0 to 65535)
    moisture_raw = moisture_sensor.read_u16()
    
    # Calculate the moisture percentage based on calibration values
    moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
    # Clamp the moisture value to be within 0-100%
    moisture_value = max(0, min(100, round(moisture_value, 2)))
    
    # Print the moisture level in percentage
    print("Moisture Level:", moisture_value, "%")
    
    # Wait a bit before next reading
    time.sleep(2)