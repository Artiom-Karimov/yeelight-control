import { Config, ConfigParams, YeelightConfig } from './config';
import { DiscoveredList } from './discovery/discovered-list';
import { Discovery } from './discovery/discovery';
import { DiscoveryData } from './discovery/discovery-data';
import { DeviceList } from './device/device-list';
import { Device } from './device/device';
import { EventEmitter } from 'node:events';

export enum YeelightEvent {
  discovery = 'discovery',
}

export class Yeelight {
  private readonly config: Config;
  private readonly discovered: DiscoveredList;
  private readonly discovery: Discovery;
  private readonly devices: DeviceList;

  private readonly emitter = new EventEmitter();

  constructor(params?: ConfigParams) {
    this.config = new YeelightConfig(params);
    this.discovered = new DiscoveredList();
    this.discovery = new Discovery(this.config, this.discovered);
    this.devices = new DeviceList(this.config);

    this.initializeEvents();
  }

  connectOne(ip: string, port?: number): Device {
    return this.devices.create(ip, port);
  }
  connectDiscovered(data: DiscoveryData): Device {
    return this.devices.createFromDiscovery(data);
  }

  on(
    event: YeelightEvent.discovery,
    cb: (data: DiscoveryData[]) => void,
  ): Yeelight;

  on(event: YeelightEvent, cb: (...args: any[]) => void): Yeelight {
    this.emitter.on(event, cb);
    return this;
  }
  removeListener(event: YeelightEvent, cb: (...args: any[]) => void): Yeelight {
    this.emitter.removeListener(event, cb);
    return this;
  }

  private initializeEvents(): void {
    this.discovery.on('update', (data: DiscoveryData[]) =>
      this.emitter.emit('discovery', data),
    );
  }
}
