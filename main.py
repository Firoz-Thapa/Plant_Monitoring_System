from machine import ADC,Pin
from utime import sleep

rled=Pin(16, Pin.OUT)
gled=Pin(25, Pin.OUT)
moisture=ADC(26)

while True:
    gled.value(0)
    reading=moisture.read_u16()
    voltage=3300*reading/65535
    print("{:.1f}mV".format(voltage))
    if voltage<500:
        for i in range(5):
            rled.value(1)
            sleep(.5)
            rled.value(0)
            sleep(.5)
        sleep(1)
    
        


    