import { Device } from '../device/device';
import { DiscoveryData } from '../discovery/discovery-data';
import { Yeelight } from '../yeelight';

const connectedDevices = new Set<Device>();

/* Function will be called several times with overlapping devices,
 * but yeelight will return already existing ones */
const add = (data: DiscoveryData[], yeelight: Yeelight): void => {
  for (const discovered of data) {
    const device = yeelight.connectDiscovered(discovered);
    connectedDevices.add(device);
  }

  console.log('Connected devices:');
  for (const device of connectedDevices) {
    console.log(`${device.ip}`);
  }
};

export const start = () => {
  const yeelight = new Yeelight();
  yeelight.on('discovery', (devices) => add(devices, yeelight));
};

start();
