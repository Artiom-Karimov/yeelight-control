import { Yeelight } from './yeelight';
import { Device, DeviceEvent } from './device/device';

const blink = (device: Device) => {
  // setInterval(() => device.toggle(), 5000);
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne('192.168.88.22');
  device
    .on(DeviceEvent.connect, () => blink(device))
    .on(DeviceEvent.update, (data) => console.log(data))
    .on(DeviceEvent.debug, (message) => console.log(message));
};

start();
