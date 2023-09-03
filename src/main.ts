import { Config } from './config';
import { DeviceData } from './device/device-data';
import { Discovery } from './discovery';

export const start = () => {
  const config = new Config();
  const discovery = new Discovery(config);
  discovery.on('listening', () => discovery.sendRequest());
  discovery.on('update', (device: DeviceData) =>
    console.log(JSON.stringify(device, undefined, 2)),
  );
};

start();
