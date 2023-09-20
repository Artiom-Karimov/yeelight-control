import { Config, ConfigParams } from './config';
import { DiscoveredList } from './discovery/discovered-list';
import { Discovery } from './discovery/discovery';
import { DiscoveryData } from './discovery/discovery-data';
import { DeviceList } from './device/device-list';
import { Device } from './device/device';
import { EventEmitter } from 'node:events';

export class Yeelight extends EventEmitter {
  private readonly config: Config;
  private readonly discovered: DiscoveredList;
  private readonly discovery: Discovery;
  private readonly devices: DeviceList;

  constructor(params?: ConfigParams) {
    super();

    this.config = new Config(params);
    this.discovered = new DiscoveredList();
    this.discovery = new Discovery(this.config, this.discovered);
    this.devices = new DeviceList(this.config);

    this.initializeEvents();
  }

  createDevice(ip: string, port?: number): Device {
    return this.devices.create(ip, port);
  }
  createDeviceFromDiscovery(data: DiscoveryData): Device {
    return this.devices.createFromDiscovery(data);
  }

  private initializeEvents(): void {
    this.discovery.on('update', (data: DiscoveryData[]) =>
      this.emit('discovery', data),
    );
  }
}
