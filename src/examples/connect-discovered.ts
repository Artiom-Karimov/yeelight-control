import { Device } from '../device/device';
import { DiscoveryData } from '../discovery/discovery-data';
import { Yeelight } from '../yeelight';

const connectedDevices = new Set<Device>();

/* Function will be called several times with overlapping devices,
 * but yeelight will return already existing ones if you'll try to connect them again.
 * The 0st element is always the newest discovered. */
const add = (data: DiscoveryData[], yeelight: Yeelight): void => {
  const device = yeelight.connectDiscovered(data[0]);
  connectedDevices.add(device);

  console.log('Connected devices:');
  for (const device of connectedDevices) {
    console.log(`${device.ip}`);
  }
};

const start = () => {
  const yeelight = new Yeelight();
  yeelight.on('discovery', (data) => add(data, yeelight));
};

start();
