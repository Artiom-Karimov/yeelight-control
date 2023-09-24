import { Device } from '../device/device';
import { Feature } from '../device/enums/feature';
import { Yeelight } from '../yeelight';

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

  device.on('connect', () => powerOn(device));
  device.on('update', (state) => console.log(`Power: ${state.power}`));
};

start();
