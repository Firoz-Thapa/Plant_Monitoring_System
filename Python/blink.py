from machine import Pin

import time
led = Pin("LED", Pin.OUT)
while True:
    led.low()
    time.sleep_ms(1000)
    led.high()
    time.sleep_ms(1000)
