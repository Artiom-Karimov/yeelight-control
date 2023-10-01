import { CommandLibrary } from '../command-library';
import { Yeelight } from '../yeelight';

const ip = '192.168.88.22';
const yeelight = new Yeelight({ disableDiscovery: true });
const device = yeelight.connectOne(ip);

// do nothing for ms milliseconds
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// do some random stuff
const sequence = async () => {
  device.command(CommandLibrary.powerOn());

  await wait(500);
  device.command(CommandLibrary.setBright(100));
  device.command(CommandLibrary.setRgb(0x0099ff));

  await wait(1000);
  device.command(CommandLibrary.setBright(50));
  device.command(CommandLibrary.setRgb(0xff9900));

  await wait(1000);
  device.command(CommandLibrary.powerOff);

  await wait(50);
  device.disconnect();

  await wait(5000);
  device.connect();
};

device.on('connect', sequence);
device.on('connect', () => console.log('connected'));
device.on('disconnect', () => console.log('disconnected'));
