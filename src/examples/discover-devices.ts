import { DiscoveryData } from '../discovery/discovery-data';
import { Yeelight } from '../yeelight';

const printAddresses = (devices: DiscoveryData[]): void => {
  console.log('New discovery:');

  for (const device of devices) {
    console.log(`${device.ip}:${device.port}, ${device.info.model}`);
  }
};

/* Discovery mechanism uses UDP multicast. 
If something goes wrong, make sure that your router allows multicast */
export const start = () => {
  const yeelight = new Yeelight();
  yeelight.on('discovery', printAddresses);
};

start();
