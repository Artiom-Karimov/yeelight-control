import { Yeelight } from './yeelight';
import { Device } from './device/device';
import { Feature } from './device/enums/feature';

const effect = (device: Device) => {
  device.command({
    feature: Feature.set_power,
    value: 'on',
  });

  setInterval(
    () =>
      device.command({
        feature: Feature.adjust_color,
      }),
    5000,
  );
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne('192.168.88.22');
  device
    .on('connect', () => effect(device))
    .on('update', (data) => console.log(data))
    .on('debug', (message) => console.log(message));
};

start();
