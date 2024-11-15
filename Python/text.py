import time
from machine import Pin, ADC


moisture_sensor = ADC(Pin(26))


print("Make sure the sensor is in dry air (not touching anything).")
time.sleep(5) 
dry_value = moisture_sensor.read_u16()
print("Calibrated dry value (air):", dry_value)


print("Place the sensor in water or wet soil, then wait...")
time.sleep(5)  
wet_value = moisture_sensor.read_u16()
print("Calibrated wet value (wet soil or water):", wet_value)


while True:

    moisture_raw = moisture_sensor.read_u16()
    

    moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100

    moisture_value = max(0, min(100, round(moisture_value, 2)))
    

    print("Moisture Level:", moisture_value, "%")
    

    time.sleep(2)