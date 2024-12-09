#import time
#from machine import Pin, ADC, SPI
#import ST7735
#
## Initialize the moisture sensor on Pin 26 (ADC0)
#moisture_sensor = ADC(Pin(26))
#
## Initialize LCD
#spi = SPI(0, baudrate=8000000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(19), miso=Pin(16))
#lcd = ST7735.ST7735(spi, rst=Pin(6), ce=Pin(17), dc=Pin(3))
#backlight = Pin(2, Pin.OUT)
#
## Turn backlight on
#backlight.high()
#lcd.reset()
#lcd.begin()
#
#def write_text(lcd, x, y, text):
#    """Display text on the LCD using p_string without color argument"""
#    lcd.p_string(x, y, text)  # Display text at specified location (color set separately if needed)
#
## Step 1: Measure dry value
#print("Make sure the sensor is in dry air (not touching anything).")
#lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen to black
#write_text(lcd, 10, 20, "Calibrating dry value...")  # No color argument
#time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
#dry_value = moisture_sensor.read_u16()
#print("Calibrated dry value (air):", dry_value)
#
## Step 2: Measure wet value
#print("Place the sensor in water or wet soil, then wait...")
#lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen
#write_text(lcd, 10, 20, "Calibrating wet value...")  # No color argument
#time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
#wet_value = moisture_sensor.read_u16()
#print("Calibrated wet value (wet soil or water):", wet_value)
#
## Check if calibration values are identical
#if dry_value == wet_value:
#    print("Error: Calibration values are identical. Cannot proceed.")
#    lcd.fill_screen(lcd.rgb_to_565(255, 0, 0))  # Clear screen and set red background for error
#    write_text(lcd, 10, 20, "Calibration failed!")
#    write_text(lcd, 10, 50, "Check sensor")
#else:
#    # Main loop to read and display moisture levels
#    while True:
#        # Read the raw moisture level
#        moisture_raw = moisture_sensor.read_u16()
#        
#        # Calculate the moisture percentage based on calibration values
#        moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
#        # Clamp the moisture value to be within 0-100%
#        moisture_value = max(0, min(100, round(moisture_value, 2)))
#        
#        # Print the moisture level in percentage on the LCD
#        lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen for new text
#        write_text(lcd, 10, 20, "Moisture Level:")
#        write_text(lcd, 10, 50, f"{moisture_value} %")  # Display moisture percentage
#        
#        # Print moisture level to the console as well (optional)
#        print("Moisture Level:", moisture_value, "%")
#        
#        # Wait a bit before next reading
#        time.sleep(2)


##import time
##from machine import Pin, ADC, SPI
##import ST7735
##import urequests
##import network
##
### Wi-Fi Setup
##ssid = "ASUS_2C"  # Replace with your Wi-Fi SSID
##password = "Firoz@123"  # Replace with your Wi-Fi password
##
##wlan = network.WLAN(network.STA_IF)
##wlan.active(True)
##wlan.connect(ssid, password)
##
##while not wlan.isconnected():
##    pass
##
##print("Connected to Wi-Fi:", wlan.ifconfig())
##
### Backend API Endpoint (InfluxDB via Node.js)
##url = "http://firoz.northeurope.cloudapp.azure.com:8086"  # Replace with your backend server IP and port
##
### Initialize the moisture sensor on Pin 26 (ADC0)
##moisture_sensor = ADC(Pin(26))
##
### Initialize LCD
##spi = SPI(0, baudrate=8000000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(19), miso=Pin(16))
##lcd = ST7735.ST7735(spi, rst=Pin(6), ce=Pin(17), dc=Pin(3))
##backlight = Pin(2, Pin.OUT)
##
### Turn backlight on
##backlight.high()
##lcd.reset()
##lcd.begin()
##
##def write_text(lcd, x, y, text):
##    """Display text on the LCD using p_string without color argument"""
##    lcd.p_string(x, y, text)  # Display text at specified location
##
### Step 1: Measure dry value
##print("Make sure the sensor is in dry air (not touching anything).")
##lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen to black
##write_text(lcd, 10, 20, "Calibrating dry value...")  # No color argument
##time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
##dry_value = moisture_sensor.read_u16()
##print("Calibrated dry value (air):", dry_value)
##
### Step 2: Measure wet value
##print("Place the sensor in water or wet soil, then wait...")
##lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen
##write_text(lcd, 10, 20, "Calibrating wet value...")  # No color argument
##time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
##wet_value = moisture_sensor.read_u16()
##print("Calibrated wet value (wet soil or water):", wet_value)
##
### Check if calibration values are identical
##if dry_value == wet_value:
##    print("Error: Calibration values are identical. Cannot proceed.")
##    lcd.fill_screen(lcd.rgb_to_565(255, 0, 0))  # Set red background for error
##    write_text(lcd, 10, 20, "Calibration failed!")
##    write_text(lcd, 10, 50, "Check sensor")
##else:
##    # Main loop to read and display moisture levels and send to InfluxDB
##    while True:
##        # Read the raw moisture level
##        moisture_raw = moisture_sensor.read_u16()
##        
##        # Calculate the moisture percentage based on calibration values
##        moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
##        # Clamp the moisture value to be within 0-100%
##        moisture_value = max(0, min(100, round(moisture_value, 2)))
##        
##        # Print the moisture level in percentage on the LCD
##        lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen for new text
##        write_text(lcd, 10, 20, "Moisture Level:")
##        write_text(lcd, 10, 50, f"{moisture_value} %")  # Display moisture percentage
##        
##        # Print moisture level to the console as well
##        print("Moisture Level:", moisture_value, "%")
##        
##        # Send the data to the backend
##        try:
##            data = {"value": moisture_value}
##            response = urequests.post(url, json=data)
##            print(f"Response from server: {response.status_code}")
##            response.close()
##        except Exception as e:
##            print(f"Error sending data to server: {e}")
##        
##        # Wait a bit before the next reading
##        time.sleep(2)
##

import time
from machine import Pin, ADC, SPI
import ST7735
import urequests
import network
import ubinascii

# Wi-Fi Setup
ssid = "SSID"  # Replace with your Wi-Fi SSID
password = "Password"  # Replace with your Wi-Fi password

# InfluxDB Configuration
INFLUXDB_URL = "your Url"
INFLUXDB_BUCKET = "your bucket"  # Replace with your bucket name
INFLUXDB_ORG = "Your Organization"  # Replace with your organization
INFLUXDB_TOKEN = "your influx db token"  # Replace with your InfluxDB token

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())

# Initialize the moisture sensor on Pin 26 (ADC0)
moisture_sensor = ADC(Pin(26))

# Initialize LCD
spi = SPI(0, baudrate=8000000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(19), miso=Pin(16))
lcd = ST7735.ST7735(spi, rst=Pin(6), ce=Pin(17), dc=Pin(3))
backlight = Pin(2, Pin.OUT)

# Turn backlight on
backlight.high()
lcd.reset()
lcd.begin()

def write_text(lcd, x, y, text):
    """Display text on the LCD using p_string without color argument"""
    lcd.p_string(x, y, text)  # Display text at specified location

#def send_to_influxdb(moisture_value: float):
#    """
#    Send data to InfluxDB using line protocol
#    """
#    try:
#        # Construct InfluxDB line protocol with explicit float
#        line_protocol = f"moisture,device=pico value={moisture_value}"
#        
#        # Prepare headers
#        headers = {
#            "Authorization": f"Token {INFLUXDB_TOKEN}",
#            "Content-Type": "text/plain; charset=utf-8",
#            "Accept": "application/json"
#        }
#        
#        # Prepare query parameters
#        params = f"bucket={INFLUXDB_BUCKET}&org={INFLUXDB_ORG}"
#        
#        # Full URL with parameters
#        full_url = f"{INFLUXDB_URL}?{params}"
#        
#        # Send request
#        response = urequests.post(
#            full_url, 
#            data=line_protocol.encode(), 
#            headers=headers
#        )
#        print(f"InfluxDB Response: {response.status_code}")
#        print(f"Sent data: {line_protocol}")
#        response.close()
#    except Exception as e:
#        print(f"Error sending to InfluxDB: {e}")

def send_to_influxdb(moisture_value: float):
    """
    Send data to InfluxDB using line protocol.
    """
    try:
        # Construct InfluxDB line protocol with explicit float formatting
        line_protocol = f"moisture,device=pico value={moisture_value:.2f}"
        
        # Prepare headers
        headers = {
            "Authorization": f"Token {INFLUXDB_TOKEN}",
            "Content-Type": "text/plain; charset=utf-8",
            "Accept": "application/json"
        }
        
        # Prepare query parameters
        params = f"bucket={INFLUXDB_BUCKET}&org={INFLUXDB_ORG}"
        
        # Full URL with correct InfluxDB endpoint
        full_url = f"{INFLUXDB_URL}/api/v2/write?{params}"
        
        # Send request
        response = urequests.post(
            full_url, 
            data=line_protocol, 
            headers=headers
        )
        
        print(f"InfluxDB Response: {response.status_code}")
        print(f"Sent data: {line_protocol}")
        response.close()
        
    except Exception as e:
        print(f"Error sending to InfluxDB: {e}")

# Step 1: Measure dry value
print("Make sure the sensor is in dry air (not touching anything).")
lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen to black
write_text(lcd, 10, 20, "Calibrating dry value...")
time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
dry_value = moisture_sensor.read_u16()
print("Calibrated dry value (air):", dry_value)

# Step 2: Measure wet value
print("Place the sensor in water or wet soil, then wait...")
lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen
write_text(lcd, 10, 20, "Calibrating wet value...")
time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
wet_value = moisture_sensor.read_u16()
print("Calibrated wet value (wet soil or water):", wet_value)

# Check if calibration values are identical
if dry_value == wet_value:
    print("Error: Calibration values are identical. Cannot proceed.")
    lcd.fill_screen(lcd.rgb_to_565(255, 0, 0))  # Set red background for error
    write_text(lcd, 10, 20, "Calibration failed!")
    write_text(lcd, 10, 50, "Check sensor")
else:
    # Main loop to read and display moisture levels and send to InfluxDB
    while True:
        # Read the raw moisture level
        moisture_raw = moisture_sensor.read_u16()
        
        # Calculate the moisture percentage based on calibration values
        moisture_value = ((dry_value - moisture_raw) / (dry_value - wet_value)) * 100
        # Clamp the moisture value to be within 0-100%
        moisture_value = float(max(0, min(100, round(moisture_value, 2))))
        
        # Print the moisture level in percentage on the LCD
        lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen for new text
        write_text(lcd, 10, 20, "Moisture Level:")
        write_text(lcd, 10, 50, f"{moisture_value} %")  # Display moisture percentage
        
        # Print moisture level to the console
        print("Moisture Level:", moisture_value, "%")
        
        # Send data to InfluxDB
        send_to_influxdb(moisture_value)
        
        # Wait a bit before the next reading
        time.sleep(2)
