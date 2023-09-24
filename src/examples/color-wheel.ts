import { CommandLibrary } from '../command-library';
import { PowerOnMode } from '../device/commands/implementations/power.command';
import { Device } from '../device/device';
import { DeviceState } from '../device/dto/device-state';
import { Yeelight } from '../yeelight';

const ip = '192.168.88.22';

const effect = (device: Device) => {
  device.command(CommandLibrary.powerOn(PowerOnMode.ColorTemperature));
  setInterval(() => device.command(CommandLibrary.adjustColor(5000)), 5000);
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
