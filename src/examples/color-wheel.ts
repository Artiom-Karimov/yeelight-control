import { Device } from '../device/device';
import { DeviceState } from '../device/dto/device-state';
import { Feature } from '../device/enums/feature';
import { Yeelight } from '../yeelight';

const ip = '192.168.88.22';

const effect = (device: Device) => {
  device.command({
    feature: Feature.set_power,
    value: 'on',
    mode: 2,
  });

  setInterval(
    () =>
      device.command({
        feature: Feature.adjust_color,
        duration: 4999,
      }),
    5000,
  );
};

const printColor = (data: DeviceState): void => {
  const color = data.rgb?.toString(16).padStart(6, '0');
  console.log(`Color: #${color}`);
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne(ip);
  device.on('connect', () => effect(device)).on('update', printColor);
};

start();
