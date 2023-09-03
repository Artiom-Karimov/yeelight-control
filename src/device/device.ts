import { DiscoveryData } from '../discovery/discovery-data';
import { ValueParser } from '../utils/value-parser';
import { DeviceState } from './device-state';

export class Device {
  private _id?: number;
  private _state: DeviceState = {};
  private readonly _ip: string;
  private readonly _port: number;

  constructor(ip: string, port: number) {
    this._ip = ValueParser.ip(ip);
    this._port = ValueParser.port(port);
  }
  public static fromDiscovery(data: DiscoveryData): Device {
    const device = new Device(data.ip, data.port);
    device._id = data.id;

    return device;
  }
}
