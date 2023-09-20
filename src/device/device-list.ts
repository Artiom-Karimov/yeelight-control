import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { Device } from './device';

export class DeviceList {
  private readonly list = new Array<Device>();

  constructor(private readonly config: Config) {}

  public create(ip: string, port?: number): Device {
    const device = this.findByIp(ip, port);
    if (device) return device;

    return new Device(this.config, ip, port);
  }
  public createFromDiscovery(data: DiscoveryData): Device {
    let device = this.findById(data.id);
    if (device) return device;

    device = Device.fromDiscovery(this.config, data);
    this.list.push(device);
    return device;
  }

  private findById(id: number): Device | undefined {
    return this.list.find((d) => d.id === id);
  }

  private findByIp(ip: string, port?: number): Device | undefined {
    if (port) return this.list.find((d) => d.ip === ip && d.port === port);
    return this.list.find((d) => d.ip === ip);
  }
}
