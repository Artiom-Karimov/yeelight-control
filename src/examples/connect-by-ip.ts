import { CommandLibrary } from '../command-library';
import { Device } from '../device/device';
import { DeviceState } from '../device/dto/device-state';
import { Yeelight } from '../yeelight';

const ip = '192.168.88.22';

const powerOn = (device: Device) => {
  device.command(CommandLibrary.powerOn());
};
const printStatus = (state: DeviceState) => {
  console.log(`Power: ${state.power}`);
};

export const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne(ip);

  device.on('connect', () => powerOn(device));
  device.on('update', printStatus);
};

start();
