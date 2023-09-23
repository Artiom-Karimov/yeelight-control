import { Device, DeviceEvent } from '../src/device/device';
import { Feature } from '../src/device/enums/feature';
import { Yeelight } from '../src/yeelight';

const ip = '192.168.88.22';

const powerOn = (device: Device) => {
  device.command({
    feature: Feature.set_power,
    value: 'on',
  });
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne(ip);

  device.on(DeviceEvent.connect, () => powerOn(device));
  device.on(DeviceEvent.update, (state) =>
    console.log(`Power: ${state.power}`),
  );
};

start();
