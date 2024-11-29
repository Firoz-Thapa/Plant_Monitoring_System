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


import time
from machine import Pin, ADC, SPI
import ST7735
import urequests
import network

# Wi-Fi Setup
ssid = "you ssid"  # Replace with your Wi-Fi SSID
password = "your password"  # Replace with your Wi-Fi password

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

while not wlan.isconnected():
    pass

print("Connected to Wi-Fi:", wlan.ifconfig())

# Backend API Endpoint (InfluxDB via Node.js)
url = "your url/moisture"  # Replace with your backend server IP and port

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

# Step 1: Measure dry value
print("Make sure the sensor is in dry air (not touching anything).")
lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen to black
write_text(lcd, 10, 20, "Calibrating dry value...")  # No color argument
time.sleep(5)  # Wait 5 seconds to give you time to position the sensor
dry_value = moisture_sensor.read_u16()
print("Calibrated dry value (air):", dry_value)

# Step 2: Measure wet value
print("Place the sensor in water or wet soil, then wait...")
lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen
write_text(lcd, 10, 20, "Calibrating wet value...")  # No color argument
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
        moisture_value = max(0, min(100, round(moisture_value, 2)))
        
        # Print the moisture level in percentage on the LCD
        lcd.fill_screen(lcd.rgb_to_565(0, 0, 0))  # Clear the screen for new text
        write_text(lcd, 10, 20, "Moisture Level:")
        write_text(lcd, 10, 50, f"{moisture_value} %")  # Display moisture percentage
        
        # Print moisture level to the console as well
        print("Moisture Level:", moisture_value, "%")
        
        # Send the data to the backend
        try:
            data = {"value": moisture_value}
            response = urequests.post(url, json=data)
            print(f"Response from server: {response.status_code}")
            response.close()
        except Exception as e:
            print(f"Error sending data to server: {e}")
        
        # Wait a bit before the next reading
        time.sleep(2)
