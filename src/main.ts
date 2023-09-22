import { Yeelight } from './yeelight';
import { Device, DeviceEvent } from './device/device';
import { Feature } from './device/enums/feature';

const effect = (device: Device) => {
  device.command({
    feature: Feature.set_power,
    value: 'on',
  });

  setInterval(
    () =>
      device.command({
        feature: Feature.set_adjust,
        action: 'circle',
        prop: 'color',
      }),
    5000,
  );
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne('192.168.88.22');
  device
    .on(DeviceEvent.connect, () => effect(device))
    .on(DeviceEvent.update, (data) => console.log(data))
    .on(DeviceEvent.debug, (message) => console.log(message));
};

start();
