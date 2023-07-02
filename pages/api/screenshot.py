import pyscreenshot as ImageGrab
# import datetime
import time

def snapshot():
#   timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
  screenshot = ImageGrab.grab()
  screenshot.save(f"pages/api/.screenshots/screenshot.png")
  print("Screenshot saved to screenshot.png")


def main():
#   time.sleep(2)
  snapshot()

if __name__ == "__main__":
    main()