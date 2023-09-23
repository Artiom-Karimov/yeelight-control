import { DiscoveryData } from '../src/discovery/discovery-data';
import { Yeelight, YeelightEvent } from '../src/yeelight';

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
  yeelight.on(YeelightEvent.discovery, printAddresses);
};

start();
